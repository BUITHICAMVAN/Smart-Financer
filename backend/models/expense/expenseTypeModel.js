// models/expenseTypeModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class ExpenseType extends Model {}

ExpenseType.init({
  expense_type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  expense_type_name: { type: DataTypes.STRING(100), allowNull: false, unique: true }
}, {
  sequelize,
  modelName: 'ExpenseType',
  tableName: 'expense_type',
  timestamps: false
});

module.exports = ExpenseType;
