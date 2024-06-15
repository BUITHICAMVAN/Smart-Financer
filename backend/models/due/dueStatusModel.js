const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db'); // Adjust the path according to your project structure

class DueStatus extends Model {}

DueStatus.init({
  due_status_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  due_status_name: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, {
  sequelize,
  modelName: 'DueStatus',
  tableName: 'due_status',
  timestamps: false
});

module.exports = DueStatus;
