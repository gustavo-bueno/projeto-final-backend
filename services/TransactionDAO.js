const TransactionModel = require('../models/Transaction');

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
    update: async function(id, transactionData) {
        return await TransactionModel.update(transactionData, {
            where: { id }
        });
    },
    delete: async function(id) {
        return await TransactionModel.destroy({
            where: { id }
        });
    },
    getById: async function(id) {
        return await TransactionModel.findByPk(id);
    }
};
