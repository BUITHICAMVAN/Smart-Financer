const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_fullname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "user_user_email_key"
    },
    user_email_verified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    user_password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    user_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_currency_unit: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    user_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    user_default_language: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    user_need_ratio: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 50.0
    },
    user_want_ratio: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 20.0
    },
    user_saving_ratio: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 30.0
    },
    user_expected_income: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "user_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_user_email_key",
        unique: true,
        fields: [
          { name: "user_email" },
        ]
      },
    ]
  });
};
