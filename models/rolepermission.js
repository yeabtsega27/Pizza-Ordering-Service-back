"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      RolePermission.belongsTo(models.Roles, {
        foreignKey: "roleId",
        onDelete: "CASCADE",
      });
      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        onDelete: "CASCADE",
      });
    }
  }
  RolePermission.init(
    {
      permissionId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RolePermission",
    }
  );
  return RolePermission;
};
