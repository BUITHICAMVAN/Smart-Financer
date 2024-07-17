const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('due', {
    due_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    due_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    due_due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    due_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    due_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    due_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'due_type',
        key: 'due_type_id'
      }
    },
    due_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'due_status',
        key: 'due_status_id'
      }
    }
  }, {
    sequelize,
    tableName: 'due',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "due_pkey",
        unique: true,
        fields: [
          { name: "due_id" },
        ]
      },
    ]
  });
};
