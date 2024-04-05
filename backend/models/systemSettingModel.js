// models/systemSettingsModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Adjust the import path as needed

class SystemSetting extends Model {}

SystemSetting.init({
  setting_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  currency: { type: DataTypes.CHAR(3), allowNull: false },
  default_language: { type: DataTypes.STRING(50), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'SystemSetting',
  tableName: 'system_settings',
  timestamps: false
});

module.exports = SystemSetting;
