// models/accountModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

class Account extends Model {}

Account.init({
  account_id: { type: DataTypes.STRING, primaryKey: true },
  account_user_id: { type: DataTypes.INTEGER, allowNull: false },
  account_type: { type: DataTypes.STRING, allowNull: false },
  account_expiresAt: { type: DataTypes.TIMESTAMP_WITH_TIME_ZONE },
  account_createdAt: { type: DataTypes.TIMESTAMP_WITH_TIME_ZONE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'Account',
  tableName: 'account',
  timestamps: false
});

module.exports = Account;
