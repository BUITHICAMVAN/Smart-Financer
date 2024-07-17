const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('income_type', {
    income_type_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    income_type_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "income_type_income_type_name_key"
    }
  }, {
    sequelize,
    tableName: 'income_type',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "income_type_income_type_name_key",
        unique: true,
        fields: [
          { name: "income_type_name" },
        ]
      },
      {
        name: "income_type_pkey",
        unique: true,
        fields: [
          { name: "income_type_id" },
        ]
      },
    ]
  });
};
