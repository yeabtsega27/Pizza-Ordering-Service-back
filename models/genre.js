"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.hasMany(models.MovieGenre, {
        foreignKey: "genreId",
        onDelete: "CASCADE",
        as: "movieGenre",
      });
      Genre.belongsToMany(models.Movie, {
        through: models.MovieGenre,
        foreignKey: "genreId",
        as: "movies",
      });
    }
  }

  Genre.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      genreName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Genre",
      tableName: "genres",
      timestamps: false,
    }
  );

  return Genre;
};
