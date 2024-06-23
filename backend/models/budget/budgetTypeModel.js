// models/budgetTypeModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class BudgetType extends Model {}

BudgetType.init({
  budget_type_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  budget_type_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: 'BudgetType',
  tableName: 'budget_type',
  timestamps: false
});

module.exports = BudgetType;
