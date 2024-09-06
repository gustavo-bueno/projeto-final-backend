const express = require("express")
const router = express.Router()
const sequelize = require("../helpers/db")
const UserDAO = require("../services/UserDAO")
const bcrypt = require('bcrypt');

router.get('/', async (_, res) => {
    await sequelize.sync({force: true})

    const passwords = ['123456', 'senha2', 'senhasecreta', '123123', '22/06/2004']
    // Encripta as senhas e retorna no array hashedPasswords. Está em ordem, ou seja, a senha do primeiro usuário é hashedPasswords[0], e assim por diante.
    const hashedPasswords = await Promise.all(passwords.map((password) => bcrypt.hash(password, 10)));

    const users = [
      {
        name: 'Gustavo',
        email: 'gustavo@gmail.com',
        password: hashedPasswords[0],
        role: 'admin'
      },
      {
        name: 'Adriano',
        email: 'adriano@gmail.com',
        password: hashedPasswords[1],
        role: 'admin'
      },
      {
        name: 'Camila',
        email: 'camila@gmail.com',
        password: hashedPasswords[2],
        role: 'user'
      },
      {
        name: 'Joaquim',
        email: 'joaquim@gmail.com',
        password: hashedPasswords[3],
        role: 'user'
      },
      {
        name: 'Letícia',
        email: 'leticia@gmail.com',
        password: hashedPasswords[4],
        role: 'user'
      }
    ]

    const createdUsers = await Promise.all(users.map((user) => UserDAO.save(user)))

    res.json({status:true, users: createdUsers })
})

module.exports = router