const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('expense', {
    expense_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    expense_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    expense_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'expense_type',
        key: 'expense_type_id'
      }
    },
    expense_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    expense_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    expense_note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'expense',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "expense_pkey",
        unique: true,
        fields: [
          { name: "expense_id" },
        ]
      },
    ]
  });
};
