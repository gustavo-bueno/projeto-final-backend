const express = require("express");
const router = express.Router();
const TransactionDAO = require('../services/TransactionDAO');
const { isAuthenticated, isAdmin } = require('../middlewares/auth'); 
const { transactionSchema, updateTransactionSchema } = require("../validators/transaction");
const { formatPrice } = require("../utils/goals")

router.get("/", isAuthenticated, async (req, res) => {
  const { limit, page } = req.query;
  const userId = req.user.id;

  try {
    const transactions = await TransactionDAO.listByUser(userId, page, limit);
    res.status(200).json({ status: true, transactions });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao listar transações' });
  }
});

router.get("/categories/:categoryId", isAdmin, async(req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const { categoryId } = req.params;

  try {
    const transactions = await TransactionDAO.listByCategory(categoryId, page, limit);
    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao listar transações por categoria' });
  }
})

router.post("/", isAuthenticated, async (req, res) => {
  const { error } = transactionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }

  const { name, description, type, date, categoryId } = req.body;
  const userId = req.user.id;

  try {
    const transaction = await TransactionDAO.save({
      name,
      description,
      type,
      date,
      categoryId,
      userId
    });
    res.status(201).json({ message: 'Transação criada com sucesso', transaction });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Falha ao criar transação' });
  }
});

router.get("/balance", isAuthenticated, async (req, res) => {
  const { startDate, endDate } = req.query;
  const userId = req.user.id;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate e a endDate são obrigatórias.' });
  }

  try {
    const transactions  = await TransactionDAO.getBalanceForPeriod(userId, startDate, endDate);

    if(!transactions.length) {
       res.status(400).json({ error: 'Não foram encontradas transações nesse período.' }); 
    }

    const balance = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
          return acc + parseFloat(transaction.amount);
      } else if (transaction.type === 'expense') {
          return acc - parseFloat(transaction.amount);
      }
      return acc;
    }, 0);

    res.status(200).json({ status: true, balance: formatPrice(balance), transactions });
  } catch (err) {
    if(err?.parent?.routine == "DateTimeParseError") {
      res.status(400).json({ error: 'Verifique as datas inseridas.' });
    }
    res.status(500).json({ error: 'Falha ao calcular o saldo para o período.' });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  const { error } = updateTransactionSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }

  const { id } = req.params;
  const { name, description, type, date, categoryId } = req.body;

  try {
    const transaction = await TransactionDAO.getById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para atualizar esta transação' });
    }

    if(name) {
      transaction.name = name;
    }

    if(description) {
      transaction.description = description;
    }

    if(type) {
      transaction.type = type;
    }

    if(date) {
      transaction.date = date;
    }

    if(categoryId) {
      transaction.categoryId = categoryId;
    }

    await transaction.save();
    res.json({ message: 'Transação atualizada com sucesso!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Falha ao atualizar transação' });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await TransactionDAO.getById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar esta transação' });
    }

    await TransactionDAO.delete(id);
    res.json({ message: 'Transação deletada com sucesso!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Falha ao deletar transação' });
  }
});

module.exports = router;
