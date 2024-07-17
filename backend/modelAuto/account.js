const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account', {
    account_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    account_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    account_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    account_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    account_language: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    account_timezone: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'account',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "account_pkey",
        unique: true,
        fields: [
          { name: "account_id" },
        ]
      },
    ]
  });
};
