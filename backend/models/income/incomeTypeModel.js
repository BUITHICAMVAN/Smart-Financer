// models/incomeTypeModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class IncomeType extends Model { }

IncomeType.init({
  income_type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  income_type_name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  sequelize,
  modelName: 'IncomeType',
  tableName: 'income_type',
  timestamps: false
});

module.exports = IncomeType;
