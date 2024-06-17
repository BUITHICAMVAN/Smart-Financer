const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const ExpenseType = require('./expenseTypeModel');

class Expense extends Model {}

Expense.init({
  expense_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  expense_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: 'user_id' } },
  expense_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  expense_note: { type: DataTypes.TEXT },
  expense_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expense_type_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: ExpenseType, key: 'expense_type_id' } }
}, {
  sequelize,
  modelName: 'Expense',
  tableName: 'expense',
  timestamps: false
});

Expense.belongsTo(ExpenseType, { foreignKey: 'expense_type_id' });

module.exports = Expense;
