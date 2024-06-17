const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const ExpenseCategory = require('./expenseCategoryModel');

class ExpenseType extends Model { }

ExpenseType.init({
  expense_type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  expense_type_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  expense_category_id: { type: DataTypes.INTEGER, references: { model: ExpenseCategory, key: 'expense_category_id' } }
}, {
  sequelize,
  modelName: 'ExpenseType',
  tableName: 'expense_type',
  timestamps: false
});

ExpenseType.belongsTo(ExpenseCategory, { foreignKey: 'expense_category_id' });

module.exports = ExpenseType;
