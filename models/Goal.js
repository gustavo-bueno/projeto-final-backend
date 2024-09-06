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
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: UserModel,
              key: 'id'
          }
      },
      categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: CategoryModel,
              key: 'id'
          }
      }
    }
);

UserModel.hasMany(GoalModel, {
  foreignKey: 'userId',
  as: 'goals'
});

CategoryModel.hasMany(GoalModel, {
  foreignKey: 'categoryId',
  as: 'goals'
});

GoalModel.belongsTo(UserModel, {
    foreignKey: 'userId', 
    as: 'user'
});

GoalModel.belongsTo(CategoryModel, {
    foreignKey: 'categoryId', 
    as: 'category'
});

module.exports = GoalModel;