const express = require("express");
const router = express.Router();
const GoalsDAO = require('../services/GoalDAO');
const { isAuthenticated } = require('../middlewares/auth');

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
  const { name, amount, description, target_date, categoryId } = req.body;
  const userId = req.user.id; 

  try {
    const goal = await GoalsDAO.save({
      name,
      amount,
      description,
      target_date,
      userId,
      categoryId
    });
    res.status(201).json({ message: 'Meta criada com sucesso', goal });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Falha ao criar meta' });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, amount, description, target_date, categoryId } = req.body;
  const userId = req.user.id;

  try {
    const goal = await GoalsDAO.getById(id);
    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: 'Meta não encontrada ou você não tem permissão para atualizar essa meta' });
    }

    const updatedGoalData = { name, amount, description, target_date, categoryId };
    await GoalsDAO.update(id, updatedGoalData);

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