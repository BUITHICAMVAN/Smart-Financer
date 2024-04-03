// models/savingTypeModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class SavingType extends Model {}

SavingType.init({
  saving_type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  saving_type_name: { type: DataTypes.STRING(255), allowNull: false }
}, {
  sequelize,
  modelName: 'SavingType',
  tableName: 'saving_type',
  timestamps: false
});

module.exports = SavingType;
