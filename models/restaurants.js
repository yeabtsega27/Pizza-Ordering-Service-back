"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurants extends Model {
    static associate(models) {
      Restaurants.hasMany(models.Users, {
        foreignKey: "restaurantsId",
      });
      Restaurants.hasMany(models.Pizza, {
        foreignKey: "restaurantsId",
      });
      Restaurants.hasMany(models.Toppings, {
        foreignKey: "restaurantsId",
      });
      Restaurants.hasMany(models.Orders, {
        foreignKey: "restaurantsId",
      });
      Restaurants.hasMany(models.Roles, {
        foreignKey: "restaurantsId",
      });
    }
  }
  Restaurants.init(
    {
      name: DataTypes.STRING,
      logo: DataTypes.STRING,
      location: DataTypes.STRING,
      super_admin: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Restaurants",
    }
  );
  return Restaurants;
};
