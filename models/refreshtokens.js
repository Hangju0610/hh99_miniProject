'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        targetKey: 'userId',
        onDelete: 'CASCAED',
        onUpdate: 'CASCAED',
      });
    }
  }
  RefreshTokens.init(
    {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      refreshToken: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'RefreshTokens',
      timestamps: false,
    }
  );
  return RefreshTokens;
};
