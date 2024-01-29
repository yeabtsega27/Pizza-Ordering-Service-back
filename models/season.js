"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Season extends Model {
    static associate(models) {
      Season.belongsTo(models.Movie, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
      });

      Season.hasMany(models.Episode, {
        foreignKey: "seasonId",
        onDelete: "CASCADE",
        as: "episodes",
      });
    }
  }

  Season.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      seasonNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Season",
      tableName: "seasons",
      timestamps: false,
    }
  );

  return Season;
};
