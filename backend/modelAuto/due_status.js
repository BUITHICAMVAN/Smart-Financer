const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('due_status', {
    due_status_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    due_status_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "due_status_due_status_name_key"
    }
  }, {
    sequelize,
    tableName: 'due_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "due_status_due_status_name_key",
        unique: true,
        fields: [
          { name: "due_status_name" },
        ]
      },
      {
        name: "due_status_pkey",
        unique: true,
        fields: [
          { name: "due_status_id" },
        ]
      },
    ]
  });
};
