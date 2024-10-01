const { where } = require("sequelize");
const { Users, Roles, Permission, RolePermission } = require("../../models");
const {
  createRoleSchema,
  assignRoleSchema,
  modifyRolePermissionSchema,
} = require("../validations/roleValidation");

// Controller to create a new role

exports.createRole = async (req, res) => {
  if (!req.ability.can("create", "Roles")) {
    return res.status(403).json({ msg: "Permission denied to create roles" });
  }

  // Validate the input with Zod
  const result = createRoleSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => err.path[0] + " " + err.message
    );
    return res.status(400).json({ errors });
  }

  const { name, addedPermissions } = req.body;

  try {
    // Check if the role already exists in the restaurant
    const roleExists = await Roles.findOne({
      where: { name, restaurantsId: req.user.restaurantsId },
    });
    if (roleExists) {
      return res
        .status(400)
        .json({ msg: "Role already exists for this restaurant" });
    }

    // Create the new role
    const createdrole = await Roles.create({
      name,
      restaurantsId: req.user.restaurantsId,
    });

    await Promise.all(
      addedPermissions.map((id) =>
        RolePermission.create({ roleId: createdrole.id, permissionId: id })
      )
    );

    const role = await Roles.findOne({
      where: { id: createdrole.id },
      include: [
        {
          model: Permission,
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
      // Set offset for pagination
    });
    res.status(201).json({
      msg: "Role created successfully",
      role,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Controller to assign a role to a user
exports.assignRole = async (req, res) => {
  if (!req.ability.can("manage", "restaurant_manager")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edite restaurant manager" });
  }

  // Validate the input with Zod
  const result = assignRoleSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => err.path[0] + " " + err.message
    );
    return res.status(400).json({ errors });
  }

  const { userId, roleId } = req.body;

  try {
    // Check if the user exists
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the role exists
    const role = await Roles.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }

    // Assign the role to the user
    user.sub_role = roleId;
    await user.save();

    res.status(200).json({
      msg: "Role assigned to user successfully",
      user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Controller to add permission to a role
exports.addPermissionToRole = async (req, res) => {
  if (!req.ability.can("manage", "Roles")) {
    return res.status(403).json({ msg: "Permission denied to manage roles" });
  }
  // Validate input
  const result = modifyRolePermissionSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => err.path[0] + " " + err.message
    );
    return res.status(400).json({ errors });
  }

  const { roleId, permissionId } = req.body;

  try {
    // Check if role and permission exist
    const role = await Roles.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);

    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }

    if (!permission) {
      return res.status(404).json({ msg: "Permission not found" });
    }

    // Check if the permission is already added to the role
    const existingPermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });

    if (existingPermission) {
      return res
        .status(400)
        .json({ msg: "Permission already assigned to this role" });
    }

    // Add permission to role
    await RolePermission.create({ roleId, permissionId });

    res.status(200).json({ msg: "Permission added to role successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Controller to remove permission from a role
exports.removePermissionFromRole = async (req, res) => {
  if (!req.ability.can("manage", "Roles")) {
    return res.status(403).json({ msg: "Permission denied to manage roles" });
  }
  // Validate input
  const result = modifyRolePermissionSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => err.path[0] + " " + err.message
    );
    return res.status(400).json({ errors });
  }

  const { roleId, permissionId } = req.body;

  try {
    // Check if the permission is assigned to the role
    const rolePermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });

    if (!rolePermission) {
      return res
        .status(404)
        .json({ msg: "Permission not found for this role" });
    }

    // Remove the permission from the role
    await rolePermission.destroy();

    res.status(200).json({ msg: "Permission removed from role successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getRolesByRestaurant = async (req, res) => {
  if (!req.ability.can("read", "Roles")) {
    return res.status(403).json({ msg: "Permission denied to read roles" });
  }
  try {
    const roles = await Roles.findAll({
      where: {
        restaurantsId: req.user.restaurantsId,
      },
      include: [
        {
          model: Permission,
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
      // Set offset for pagination
    });

    // Send paginated response
    res.status(200).json({
      roles,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching roles for restaurant", error });
  }
};

exports.getRolesById = async (req, res) => {
  if (!req.ability.can("read", "Roles")) {
    return res.status(403).json({ msg: "Permission denied to read roles" });
  }
  const { id } = req.params;

  try {
    const roles = await Roles.findByPk(id, {
      include: [
        {
          model: Permission,
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
      // Set offset for pagination
    });

    // Send paginated response
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching roles for restaurant", error });
  }
};

exports.updateRole = async (req, res) => {
  if (!req.ability.can("manage", "Roles")) {
    return res.status(403).json({ msg: "Permission denied to manage roles" });
  }
  const { id } = req.params;
  const { name, addedPermissions, removedPermissions } = req.body;
  try {
    const role = await Roles.findByPk(id);
    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }
    role.name = name;
    await role.save();

    await Promise.all(
      addedPermissions.map((addId) =>
        RolePermission.create({ roleId: role.id, permissionId: addId })
      )
    );
    await Promise.all(
      removedPermissions.map(async (addId) => {
        const rolePermission = await RolePermission.findOne({
          where: { roleId: role.id, permissionId: addId },
        });

        if (!rolePermission) {
          return res
            .status(404)
            .json({ msg: "Permission not found for this role" });
        }

        await rolePermission.destroy();
      })
    );

    res.status(200).json({ msg: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error updating role", error });
  }
};

exports.deleteRole = async (req, res) => {
  if (!req.ability.can("manage", "Roles")) {
    return res.status(403).json({ msg: "Permission denied to manage roles" });
  }
  const { id } = req.params;
  try {
    const role = await Roles.findByPk(id);
    if (!role) {
      return res.status(404).json({ msg: "Role not found" });
    }
    await role.destroy();
    res.status(200).json({ msg: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting role", error });
  }
};
