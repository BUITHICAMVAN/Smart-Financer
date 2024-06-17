const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class ExpenseCategory extends Model {}

ExpenseCategory.init({
  expense_category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  expense_category_name: { type: DataTypes.STRING(100), allowNull: false, unique: true }
}, {
  sequelize,
  modelName: 'ExpenseCategory',
  tableName: 'expense_category',
  timestamps: false
});

module.exports = ExpenseCategory;
