const { z } = require("zod");

// Zod schema for creating roles
const createRoleSchema = z.object({
  name: z.string().min(3, { msg: "Role name is required" }),
  addedPermissions: z
    .array(z.number())
    .min(1, { msg: "At list one permissin is required" }),
});

// Zod schema for assigning roles to users
const assignRoleSchema = z.object({
  userId: z
    .number()
    .int()
    .nonnegative({ msg: "userId must be a positive integer" }),
  roleId: z
    .number()
    .int()
    .nonnegative({ msg: "roleId must be a positive integer" }),
});

// Zod schema for adding/removing permissions to/from roles
const modifyRolePermissionSchema = z.object({
  roleId: z
    .number()
    .int()
    .nonnegative({ msg: "roleId must be a positive integer" }),
  permissionId: z
    .number()
    .int()
    .nonnegative({ msg: "permissionId must be a positive integer" }),
});

module.exports = {
  assignRoleSchema,
  createRoleSchema,
  modifyRolePermissionSchema,
};
