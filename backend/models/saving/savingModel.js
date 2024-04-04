// models/savingModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db'); // Ensure this path is correct for your project setup

class Saving extends Model {}

Saving.init({
  saving_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  saving_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: 'user_id' } },
  saving_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  saving_note: { type: DataTypes.TEXT },
  saving_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  saving_type_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'saving_type', key: 'saving_type_id' } }
}, {
  sequelize,
  modelName: 'Saving',
  tableName: 'saving',
  timestamps: false
});

module.exports = Saving;
