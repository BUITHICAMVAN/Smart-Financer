const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('due_type', {
    due_type_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    due_type_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "due_type_due_type_name_key"
    }
  }, {
    sequelize,
    tableName: 'due_type',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "due_type_due_type_name_key",
        unique: true,
        fields: [
          { name: "due_type_name" },
        ]
      },
      {
        name: "due_type_pkey",
        unique: true,
        fields: [
          { name: "due_type_id" },
        ]
      },
    ]
  });
};
