const UserModel = require('../models/User')

module.exports = {
    list: async function() {
        const users = await UserModel.findAll()
        return users
    },
    save: async function(userData) {
        const user = await UserModel.create(userData)
        return user
    },
    update: async function(id, password, name) {
        return await UserModel.update({ name, password }, {
            where: { id }
        })
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