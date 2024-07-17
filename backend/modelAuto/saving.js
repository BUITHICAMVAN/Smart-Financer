const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('saving', {
    saving_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    saving_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    saving_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    saving_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    saving_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'saving_type',
        key: 'saving_type_id'
      }
    },
    saving_note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'saving',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "saving_pkey",
        unique: true,
        fields: [
          { name: "saving_id" },
        ]
      },
    ]
  });
};
