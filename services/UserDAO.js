const UserModel = require('../models/User')

module.exports = {
    list: async function(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const users = await UserModel.findAll({
            offset,
            limit
        })
        return users
    },
    save: async function(userData) {
        const user = await UserModel.create(userData)
        return user
    },
    delete: async function(id) {
        // Precisa fazer algo para os livros que este autor possui
        return await UserModel.destroy({where: { id }})
    },
    findUserByEmail: async function(email) {
        return await UserModel.findOne({ where: { email } })
    },
    getById: async function (id) {
        return await UserModel.findByPk(id);
    }
}