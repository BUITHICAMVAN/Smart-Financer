const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('forecast', {
    forecast_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    forecast_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    forecast_related_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    forecast_related_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    forecast_month: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    forecast_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    forecast_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    forecast_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'forecast',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "forecast_pkey",
        unique: true,
        fields: [
          { name: "forecast_id" },
        ]
      },
    ]
  });
};
