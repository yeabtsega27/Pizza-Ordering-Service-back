"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.hasMany(models.MovieLink, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
        as: "movieLinks",
      });

      Movie.hasMany(models.MovieGenre, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
      });

      Movie.hasMany(models.Favorite, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
        as: "movie",
      });

      Movie.hasMany(models.Like, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
        as: "like",
      });

      Movie.hasMany(models.Season, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
      });

      Movie.hasMany(models.Episode, {
        foreignKey: "movieId",
        onDelete: "CASCADE",
      });
      Movie.belongsToMany(models.Genre, {
        through: models.MovieGenre,
        foreignKey: "movieId",
        as: "genres",
      });
    }
  }

  Movie.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cast: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      voteCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10,
      },
      posterLandscape: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      posterPortrait: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      overview: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trailer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      production: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      type: {
        type: DataTypes.ENUM("Movie", "Drama"),
        allowNull: true,
        defaultValue: "Movie",
      },
    },
    {
      sequelize,
      modelName: "Movie",
      tableName: "movies",
      timestamps: true,
    }
  );

  return Movie;
};
