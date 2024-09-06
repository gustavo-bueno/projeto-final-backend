const express = require("express")
const router = express.Router()
const CategoryDAO = require('../services/CategoryDAO');
const { isAdmin } = require('../middlewares/auth');

router.get("/", async (req, res) => {
  const { limit, page } = req.query;

  try {
    const categories = await CategoryDAO.list(page, limit)
    res.status(201).json({ status: true, categories });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Falha ao listar categorias' });
  }
})

router.post("/", isAdmin, async (req, res) => {
  const { name, description, type } = req.body;

  try {
    const category = await CategoryDAO.save({
      name,
      description,
      type,
    });
    res.status(201).json({ message: 'Categoria criada com sucesso', category });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao criar categoria' });
  }
})

router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const category = await CategoryDAO.getById(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await category.destroy();
    res.json({ message: 'Categoria deletada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao deletar categoria' });
  }
});

router.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { description, name, type } = req.body;

  try {
    const category = await CategoryDAO.getById(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    if(description) {
      category.description = description;
    }

    if(name) {
      category.name = name;
    }

    if(type) {
      category.type = type;
    }

    await category.save();
    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar as informações do usuário.' });
  }
});

module.exports = router;
