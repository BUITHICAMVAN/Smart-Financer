const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('income', {
    income_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    income_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    income_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    income_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'income_type',
        key: 'income_type_id'
      }
    },
    income_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    income_note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'income',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "income_pkey",
        unique: true,
        fields: [
          { name: "income_id" },
        ]
      },
    ]
  });
};
