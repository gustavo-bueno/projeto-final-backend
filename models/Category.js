const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/db")

const CategoryModel = sequelize.define('Category', 
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
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        type: {
          type: DataTypes.ENUM('Transaction', 'Goal'),
          allowNull: false,
        },
    }
)

CategoryModel.hasMany(TransactionModel, {
  foreignKey: 'categoryId',
  as: 'transactions'
});

CategoryModel.hasMany(GoalModel, {
  foreignKey: 'categoryId',
  as: 'goals'
});

module.exports = CategoryModel