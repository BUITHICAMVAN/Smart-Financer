const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('saving_type', {
    saving_type_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    saving_type_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'saving_type',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "saving_type_pkey",
        unique: true,
        fields: [
          { name: "saving_type_id" },
        ]
      },
    ]
  });
};
