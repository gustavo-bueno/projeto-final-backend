const express = require("express")
const router = express.Router()
const sequelize = require("../helpers/db")
const UserDAO = require("../services/UserDAO")
const bcrypt = require('bcrypt');
const CategoryDAO = require("../services/CategoryDAO");
const TransactionDAO = require("../services/TransactionDAO");
const GoalDAO = require("../services/GoalDAO");

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

    const categories = [
      {
        name: 'Alimentação',
        description: 'Alimentos em geral',
        type: 'Transaction'
      },
      {
        name: 'Moradia',
        description: 'Despesas com a casa',
        type: 'Transaction'
      },
      {
        name: 'Mercado',
        description: 'Compras gerais',
        type: 'Transaction'
      },
      {
        name: 'Lazer',
        description: 'Compras para lazer',
        type: 'Transaction'
      },
      {
        name: 'Casa',
        description: 'Categoria para a meta casa',
        type: 'Goal'
      },
      {
        name: 'Carro',
        description: 'Categoria para a meta carro',
        type: 'Goal'
      },
      {
        name: 'Viagem',
        description: 'Categoria para viagens',
        type: 'Goal'
      }
    ]

    const goals = [
      {
        name: 'Comprar uma casa',
        amount: 300000,
        description: 'Economizar para a compra de uma casa própria',
        target_date: '2025-12-31',
        userId: 3,
        categoryId: 5
      },
      {
        name: 'Comprar um carro',
        amount: 50000,
        description: 'Economizar para a compra de um carro novo',
        target_date: '2024-06-30',
        userId: 4, 
        categoryId: 6 
      },
      {
        name: 'Reforma da casa',
        amount: 20000,
        description: 'Economizar para a reforma da sala e cozinha',
        target_date: '2024-12-01',
        userId: 5, 
        categoryId: 5 
      },
      {
        name: 'Viagem para a Europa',
        amount: 10000,
        description: 'Economizar para uma viagem de 15 dias para a Europa',
        target_date: '2025-05-15',
        userId: 3,
        categoryId: 7
      },
      {
        name: 'Curso de especialização',
        amount: 7000,
        description: 'Economizar para o curso de especialização em tecnologia',
        target_date: '2024-09-01',
        userId: 4, 
        categoryId: 6
      }
    ]

    const transactions = [
      {
        name: 'Compra de móveis',
        description: 'Compra de móveis para a nova casa',
        type: 'expense',
        date: '2024-02-15',
        userId: 3, 
        categoryId: 1,
        amount: 1000
      },
      {
        name: 'Bônus de fim de ano',
        description: 'Recebido bônus de fim de ano',
        type: 'income',
        date: '2023-12-20',
        userId: 4,
        categoryId: 2,
        amount: 5000
      },
      {
        name: 'Jantar em restaurante',
        description: 'Jantar em restaurante italiano',
        type: 'expense',
        date: '2024-03-10',
        userId: 5,
        categoryId: 4 ,
        amount: 250
      },
      {
        name: 'Venda de itens usados',
        description: 'Venda de itens usados no marketplace',
        type: 'income',
        date: '2024-01-05',
        userId: 3, 
        categoryId: 3,
        amount: 400
      },
      {
        name: 'Curso online de programação',
        description: 'Pagamento do curso online de programação',
        type: 'expense',
        date: '2024-04-01',
        userId: 4,
        categoryId: 2,
        amount: 499.99 
      }
    ]

    const createdCategories = await Promise.all(categories.map((category) => CategoryDAO.save(category)))
    const createdUsers = await Promise.all(users.map((user) => UserDAO.save(user)))
    const createdGoals = await Promise.all(goals.map((goal) => GoalDAO.save(goal)))
    const createdTransactions = await Promise.all(transactions.map((transaction) => TransactionDAO.save(transaction)))

    res.json({status:true, users: createdUsers, categories: createdCategories, goals: createdGoals, transactions: createdTransactions  })
})

module.exports = router