const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('expense_type', {
    expense_type_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    expense_type_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "expense_type_expense_type_name_key"
    },
    expense_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'expense_category',
        key: 'expense_category_id'
      }
    }
  }, {
    sequelize,
    tableName: 'expense_type',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "expense_type_expense_type_name_key",
        unique: true,
        fields: [
          { name: "expense_type_name" },
        ]
      },
      {
        name: "expense_type_pkey",
        unique: true,
        fields: [
          { name: "expense_type_id" },
        ]
      },
    ]
  });
};
