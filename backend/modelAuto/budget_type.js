const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('budget_type', {
    budget_type_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    budget_type_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "budget_type_budget_type_name_key"
    }
  }, {
    sequelize,
    tableName: 'budget_type',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "budget_type_budget_type_name_key",
        unique: true,
        fields: [
          { name: "budget_type_name" },
        ]
      },
      {
        name: "budget_type_pkey",
        unique: true,
        fields: [
          { name: "budget_type_id" },
        ]
      },
    ]
  });
};
