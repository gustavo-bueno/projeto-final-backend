const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");
const UserModel = require('./User');
const CategoryModel = require('./Category');

const GoalModel = sequelize.define('Goal', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        target_date: {
          type: DataTypes.DATE,
          allowNull: true,
        }
    }
);

GoalModel.belongsTo(UserModel, {
    foreignKey: 'userId', 
    as: 'user'
});

GoalModel.belongsTo(CategoryModel, {
    foreignKey: 'categoryId', 
    as: 'category'
});

UserModel.hasMany(GoalModel, {
    foreignKey: 'userId',
    as: 'goals'
});

module.exports = GoalModel;