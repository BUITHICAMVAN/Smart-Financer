const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db'); // Adjust the path according to your project structure

class DueType extends Model {}

DueType.init({
  due_type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  due_type_name: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, {
  sequelize,
  modelName: 'DueType',
  tableName: 'due_type',
  timestamps: false
});

module.exports = DueType;
