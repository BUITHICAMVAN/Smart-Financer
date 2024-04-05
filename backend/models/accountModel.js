// models/accountModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

class Account extends Model {}

Account.init({
  account_id: { type: DataTypes.STRING(255), primaryKey: true },
  account_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: 'user_id' }},
  account_type: { type: DataTypes.STRING(255), allowNull: false },
  account_expires_at: { type: DataTypes.DATE, allowNull: true }, 
  account_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Account',
  tableName: 'account',
  timestamps: false
});

module.exports = Account;
