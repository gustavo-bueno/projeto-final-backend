const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/db");
const GoalModel = require("./Goal");

const UserModel = sequelize.define('User', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
        }
    }
)

UserModel.hasMany(GoalModel, {
  foreignKey: 'userId',
  as: 'goals'
});

UserModel.hasMany(TransactionModel, {
  foreignKey: 'userId',
  as: 'transactions'
});

module.exports = UserModel