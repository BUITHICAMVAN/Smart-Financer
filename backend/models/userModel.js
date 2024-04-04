// models/userModel.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Adjust the path according to your project structure

class User extends Model { }

User.init({
  user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_fullname: { type: DataTypes.STRING },
  user_email: { type: DataTypes.STRING, allowNull: false, unique: true },
  user_email_verified: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  user_password_hash: { type: DataTypes.STRING },
  user_is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  user_image: { type: DataTypes.STRING },
  user_currency_unit: { type: DataTypes.CHAR(3) },
  user_created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'user',
  timestamps: false,
  // Define the default scope
  defaultScope: {
    attributes: { exclude: ['user_password_hash'] },
  },
  // Optionally, define other scopes to include the password hash when needed
  scopes: {
    withPassword: {
      attributes: {},
    },
  },
});

module.exports = User;
