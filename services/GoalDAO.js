const GoalModel = require('../models/Goal')

module.exports = {
  list: async function(userId, page = 1, limit = 10) {
      const offset = (page - 1) * limit;
      const goals = await GoalModel.findAll({
          where: { userId },
          offset,
          limit
      });
      return goals;
  },
  save: async function(goalData) {
      const goal = await GoalModel.create(goalData);
      return goal;
  },
  update: async function(id, goalData) {
      return await GoalModel.update(goalData, {
          where: { id }
      });
  },
  delete: async function(id) {
      return await GoalModel.destroy({ where: { id } });
  },
  getById: async function(id) {
      return await GoalModel.findByPk(id);
  }
}