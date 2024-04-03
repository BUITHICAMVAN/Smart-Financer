// models/incomeModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Ensure this path is correct for your project setup

class Income extends Model {}

Income.init({
  income_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  income_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: 'user_id' }},
  income_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  income_type_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'income_type', key: 'income_type_id' }},
  income_note: { type: DataTypes.TEXT },
  income_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Income',
  tableName: 'income',
  timestamps: false
});

module.exports = Income;
