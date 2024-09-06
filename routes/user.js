const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserDAO = require('../services/UserDAO');
const { isAdmin } = require('../middlewares/auth');

router.get("/", async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  try {
    const users = await UserDAO.list(page, limit)
    res.status(200).json({ status: true, users });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao listar usuários' });
  }
})

router.post("/", async (req, res) => {
  const { name, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await UserDAO.save({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });
    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao criar usuário' });
  }
})

router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserDAO.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao logar usuário' });
  }
})

router.post("/admin", isAdmin, async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await UserDAO.save({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    res.status(201).json({ message: 'Usuário admin criado com sucesso!', admin });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao criar usuário admin' });
  }
})

router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserDAO.getById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Não é possivel deletar um usuário que é admin.' });
    }

    await user.destroy();
    res.json({ message: 'Usuário deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Falha ao deletar usuário' });
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { password, name } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  try {
    const user = await UserDAO.getById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario não encontrado' });
    }
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Não é possível editar informações de outro usuário' });
    }

    if (name) {
      user.name = name;
    }

    if (hashedPassword) {
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar as informações do usuário.' });
  }
});

module.exports = router;
