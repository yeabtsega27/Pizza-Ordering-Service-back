const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");

// Create a new permission
router.post("/", permissionController.createPermission);

// Get all permissions
router.get("/", permissionController.getAllPermissions);

// Get a permission by ID
router.get("/:id", permissionController.getPermissionById);

// Update a permission by ID
router.put("/:id", permissionController.updatePermission);

// Delete a permission by ID
router.delete("/:id", permissionController.deletePermission);

module.exports = router;
