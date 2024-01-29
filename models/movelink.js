"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MovieLink extends Model {
    static associate(models) {
      MovieLink.belongsTo(models.Movie, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
      });
    }
  }

  MovieLink.init(
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
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MovieLink",
      tableName: "movie_links",
      timestamps: false,
    }
  );

  return MovieLink;
};
