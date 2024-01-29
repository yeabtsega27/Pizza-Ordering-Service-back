"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      Favorite.belongsTo(models.Movie, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
        as: "movie",
      });
    }
  }

  Favorite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
          onDelete: "CASCADE",
        },
      },
    },
    {
      sequelize,
      modelName: "Favorite",
      tableName: "favorites",
      timestamps: false,
    }
  );

  return Favorite;
};
