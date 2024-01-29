"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MovieGenre extends Model {
    static associate(models) {
      MovieGenre.belongsTo(models.Genre, {
        foreignKey: "genreId",
        onDelete: "CASCADE",
        as: "movieGenre",
      });

      MovieGenre.belongsTo(models.Movie, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
      });
    }
  }

  MovieGenre.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      genreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "genres",
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
      modelName: "MovieGenre",
      tableName: "movie_genres",
      timestamps: false,
    }
  );

  return MovieGenre;
};
