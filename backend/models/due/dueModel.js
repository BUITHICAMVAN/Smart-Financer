const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db'); // Adjust the path according to your project structure

class Due extends Model {}

Due.init({
  due_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  due_user_id: { type: DataTypes.INTEGER, allowNull: false },
  due_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  due_due_date: { type: DataTypes.DATE, allowNull: false },
  due_details: { type: DataTypes.TEXT },
  due_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  due_type_id: { type: DataTypes.INTEGER, allowNull: false },
  due_status_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  sequelize,
  modelName: 'Due',
  tableName: 'due',
  timestamps: false,
  // Define the default scope
  defaultScope: {
    attributes: { exclude: [] },
  },
  // Optionally, define other scopes
  scopes: {
    withDetails: {
      attributes: {},
    },
  },
});

module.exports = Due;
