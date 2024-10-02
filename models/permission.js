"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Roles, {
        through: models.RolePermission,
        foreignKey: "permissionId",
        onDelete: "CASCADE",
      });
    }
  }
  Permission.init(
    {
      name: DataTypes.STRING,
      action: DataTypes.STRING,
      object: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Permission",
    }
  );
  return Permission;
};
