"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Episode extends Model {
    static associate(models) {
      Episode.belongsTo(models.Movie, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
      });

      Episode.belongsTo(models.Season, {
        foreignKey: "seasonId",
        onDelete: "CASCADE",
        as: "season",
      });
    }
  }

  Episode.init(
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
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "seasons",
          key: "id",
          onDelete: "CASCADE",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      episodeLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      episodeNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Episode",
      tableName: "episodes",
      timestamps: false,
    }
  );

  return Episode;
};
