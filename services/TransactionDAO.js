const TransactionModel = require('../models/Transaction');
const { Op } = require('sequelize');

module.exports = {
    listByUser: async function(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const transactions = await TransactionModel.findAll({
            where: { userId },
            offset,
            limit
        });
        return transactions;
    },
    save: async function(transactionData) {
        const transaction = await TransactionModel.create(transactionData);
        return transaction;
    },
    delete: async function(id) {
        return await TransactionModel.destroy({
            where: { id }
        });
    },
    getById: async function(id) {
        return await TransactionModel.findByPk(id);
    },
    getBalanceForPeriod: async function(userId, startDate, endDate) {
        return await TransactionModel.findAll({
            where: {
                userId,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    }
};
