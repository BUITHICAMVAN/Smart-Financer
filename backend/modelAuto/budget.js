const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('budget', {
    budget_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    budget_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    budget_budget_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'budget_type',
        key: 'budget_type_id'
      }
    },
    budget_related_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    budget_related_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    budget_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    budget_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    budget_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'budget',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "budget_pkey",
        unique: true,
        fields: [
          { name: "budget_id" },
        ]
      },
    ]
  });
};
