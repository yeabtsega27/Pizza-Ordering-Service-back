const express = require("express");
const roleController = require("../controllers/rolesController");
const auth = require("../middleware/auth");

const router = express.Router();

// Route to create a new role
router.post("/create", auth, roleController.createRole);

// Route to assign a role to a user
router.post("/assign", auth, roleController.assignRole);

// Route to add a permission to a role
router.post("/permission/add", auth, roleController.addPermissionToRole);

// Route to remove a permission from a role
router.post(
  "/permission/remove",
  auth,
  roleController.removePermissionFromRole
);

// Route to get roles by restaurant ID
router.get("/restaurant", auth, roleController.getRolesByRestaurant);

// Route to get roles by restaurant ID
router.get("/:id", auth, roleController.getRolesById);

// Route to edit a role
router.put("/:id", auth, roleController.updateRole);

// Route to delete a role
router.delete("/:id", auth, roleController.deleteRole);

module.exports = router;
