const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");
const UserModel = require("./User");
const CategoryModel = require("./Category");

const TransactionModel = sequelize.define('Transaction', {
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
        type: DataTypes.ENUM('income', 'expense'), 
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
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
});

TransactionModel.belongsTo(UserModel, { foreignKey: 'userId' });
TransactionModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });

module.exports = TransactionModel;