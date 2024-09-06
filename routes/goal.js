const express = require("express");
const router = express.Router();
const GoalsDAO = require('../services/GoalDAO');
const { isAuthenticated } = require('../middlewares/auth');
const { getMonthsBetweenDates, formatDate, formatPrice } = require('../utils/goals');
const { goalSchema, updateGoalSchema } = require("../validators/goal");

router.get("/", isAuthenticated, async (req, res) => {
  const { limit, page } = req.query;
  const userId = req.user.id; 

  try {
    const goals = await GoalsDAO.list(userId, page, limit);
    res.status(200).json({ status: true, goals });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Falha ao listar metas' });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  const { error } = goalSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  const { name, amount, description, currentAmount, target_date, categoryId } = req.body;
  const userId = req.user.id; 

  try {
    const goal = await GoalsDAO.save({
      name,
      amount,
      description,
      target_date,
      currentAmount,
      userId,
      categoryId
    });
    res.status(201).json({ message: 'Meta criada com sucesso', goal });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Falha ao criar meta' });
  }
});

router.post("/calculate-months-left/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { monthlyPayment } = req.body;

  if(!monthlyPayment) {
    return res.status(400).json({ errors: ['O monthlyPayment é obrigatório'] });
  }

  if(typeof monthlyPayment != 'number' || monthlyPayment < 0 ) {
    return res.status(400).json({ errors: ['O monthlyPayment deve ser um número positivo'] });
  }

  try {
    const goal = await GoalsDAO.getById(id);

    if (!goal) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    if (goal.userId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para calcular o tempo que falta para esse transação' });
    }

    const remaining = Number(goal.amount) - Number(goal.currentAmount);
    const monthsRemaining = getMonthsBetweenDates(goal.target_date)
    const monthsRemainingForMonthlyPayment = remaining / monthlyPayment;
    const monthlyPaymentToAccomplishGoal = remaining / monthsRemaining;

    res.json({ 
      previsionForMonthlyPayment: `Baseado no valor mensal de ${formatPrice(monthlyPayment)}, você atingirá a meta em ${monthsRemainingForMonthlyPayment} meses`,
      monthlyPaymentNecessary: `Para atingir a meta em ${formatDate(goal.target_date)}, você precisa guardar ${formatPrice(monthlyPaymentToAccomplishGoal)} por mês.`
     });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Falha ao calcular meses que faltam' });
  }
})

router.put("/update-value/:id",isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { newValue } = req.body;
  const userId = req.user.id;

  if(!newValue) {
    return res.status(400).json({ errors: ['O newValue é obrigatório'] });
  }

  if(typeof newValue != 'number' || monthlyPayment < 0 ) {
    return res.status(400).json({ errors: ['O newValue deve ser um número positivo'] });
  }

  try {
    const goal = await GoalsDAO.getById(id);
    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: 'Meta não encontrada ou você não tem permissão para atualizar essa meta' });
    }

    goal.currentAmount = Number(goal.currentAmount) + newValue;
    await goal.save();

    res.json({ message: 'Meta atualizada com sucesso!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Erro ao atualizar meta.' });
  }
})

router.put("/:id", isAuthenticated, async (req, res) => {
  const { error } = updateGoalSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  const { id } = req.params;
  const { name, amount, description, currentAmount, target_date, categoryId } = req.body;
  const userId = req.user.id;

  try {
    const goal = await GoalsDAO.getById(id);
    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: 'Meta não encontrada ou você não tem permissão para atualizar essa meta' });
    }

    if(name) {
      goal.name = name;
    }

    if(amount) {
      goal.amount = amount;
    }

    if(currentAmount) {
      goal.currentAmount = currentAmount;
    }

    if(target_date) {
      goal.target_date = target_date;
    }

    if(description) {
      goal.description = description;
    }

    if(categoryId) {
      goal.categoryId = categoryId;
    }

    await goal.save();
    res.json({ message: 'Meta atualizada com sucesso!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Erro ao atualizar meta.' });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const goal = await GoalsDAO.getById(id);
    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: 'Meta não encontrada ou você não tem permissão para excluir essa meta' });
    }

    await GoalsDAO.delete(id);
    res.json({ message: 'Meta deletada com sucesso!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Erro ao deletar meta.' });
  }
});

module.exports = router;