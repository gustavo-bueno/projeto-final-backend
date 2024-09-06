const express = require("express");
const router = express.Router();
const TransactionDAO = require('../services/TransactionDAO');
const { isAuthenticated } = require('../middlewares/auth'); 

router.get("/", isAuthenticated, async (req, res) => {
  const { limit, page } = req.query;
  const userId = req.user.id;

  try {
    const transactions = await TransactionDAO.listByUser(userId, page, limit);
    res.status(200).json({ status: true, transactions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Falha ao listar transações' });
  }
});

// Criar uma nova transação
router.post("/", isAuthenticated, async (req, res) => {
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


router.put("/:id", isAuthenticated, async (req, res) => {
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
