"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    static associate(models) {
      Roles.belongsTo(models.Restaurants, {
        foreignKey: "restaurantsId",
        onDelete: "CASCADE",
      });
      Roles.belongsToMany(models.Permission, {
        through: "RolePermission",
        foreignKey: "roleId",
        otherKey: "permissionId",
      });
    }
  }
  Roles.init(
    {
      name: DataTypes.STRING,
      restaurantsId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Roles",
    }
  );
  return Roles;
};
