const CategoryModel = require('../models/Category')

module.exports = {
    list: async function(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const users = await CategoryModel.findAll({
            offset,
            limit
        })
        return users
    },
    save: async function(categoryData) {
        const user = await CategoryModel.create(categoryData)
        return user
    },
    delete: async function(id) {
        // Precisa fazer algo para os livros que este autor possui
        return await CategoryModel.destroy({where: { id }})
    },
    getById: async function (id) {
        return await CategoryModel.findByPk(id);
    }
}