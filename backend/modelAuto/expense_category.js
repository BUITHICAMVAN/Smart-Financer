const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('expense_category', {
    expense_category_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    expense_category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "expense_category_expense_category_name_key"
    }
  }, {
    sequelize,
    tableName: 'expense_category',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "expense_category_expense_category_name_key",
        unique: true,
        fields: [
          { name: "expense_category_name" },
        ]
      },
      {
        name: "expense_category_pkey",
        unique: true,
        fields: [
          { name: "expense_category_id" },
        ]
      },
    ]
  });
};
