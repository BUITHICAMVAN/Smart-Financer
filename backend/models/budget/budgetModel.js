// models/budgetModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const User = require('../userModel'); // Adjust path as necessary
const BudgetType = require('./budgetTypeModel'); // Adjust path as necessary

class Budget extends Model {}

Budget.init({
  budget_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  budget_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'user_id'
    }
  },
  budget_budget_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'budget_type',
      key: 'budget_type_id'
    }
  },
  budget_related_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  budget_related_type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  budget_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  budget_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  budget_created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Budget',
  tableName: 'budget',
  timestamps: false
});

// Define associations
Budget.belongsTo(User, { foreignKey: 'budget_user_id' });
Budget.belongsTo(BudgetType, { foreignKey: 'budget_budget_type_id' });

module.exports = Budget;
