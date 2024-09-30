const { Permission } = require("../models");

// Create a new permission
exports.createPermission = async (req, res) => {
  try {
    const { name, action, object } = req.body;
    const newPermission = await Permission.create({ name, action, object });
    return res.status(201).json(newPermission);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to create permission", msg: error.message });
  }
};

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    return res.status(200).json(permissions);
  } catch (error) {
    return res.status(500).json({
      error: "Unable to retrieve permissions",
      msg: error.message,
    });
  }
};

// Get a permission by ID
exports.getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ error: "Permission not found" });
    }
    return res.status(200).json(permission);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to retrieve permission", msg: error.message });
  }
};

// Update a permission by ID
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, action, object } = req.body;
    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({ error: "Permission not found" });
    }

    permission.name = name || permission.name;
    permission.action = action || permission.action;
    permission.object = object || permission.object;

    await permission.save();
    return res.status(200).json(permission);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to update permission", msg: error.message });
  }
};

// Delete a permission by ID
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({ error: "Permission not found" });
    }

    await permission.destroy();
    return res.status(200).json({ msg: "Permission deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to delete permission", msg: error.message });
  }
};
