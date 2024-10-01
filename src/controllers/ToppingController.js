const { where } = require("sequelize");
const { Toppings, Restaurants } = require("../../models");
const {
  createToppingSchema,
  updateToppingSchema,
} = require("../validations/toppingValidation");

// Create a new topping
exports.createTopping = async (req, res) => {
  if (!req.ability.can("create", "Toppings")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to create toppings" });
  }
  const result = createToppingSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path[0]}: ${err.message}`
    );
    return res.status(400).json({ errors });
  }

  const { name } = result.data;

  try {
    const restaurant = await Restaurants.findByPk(req.user.restaurantsId);
    if (!restaurant) {
      return res.status(400).json({ msg: "Restaurant not found" });
    }

    const existingTopping = await Toppings.findAll({
      where: { name, restaurantsId: req.user.restaurantsId },
    });

    if (existingTopping.length > 0) {
      return res.status(400).json({ msg: "Topping alrady existe" });
    }

    // Create topping
    const topping = await Toppings.create({
      name,
      restaurantsId: req.user.restaurantsId,
    });

    res.status(201).json({ msg: "Topping created successfully", topping });
  } catch (error) {
    res.status(500).json({ msg: "Error creating topping", error });
  }
};

// Get all toppings
exports.getAllToppings = async (req, res) => {
  if (!req.ability.can("read", "Toppings")) {
    return res.status(403).json({ msg: "Permission denied to read toppings" });
  }
  try {
    const toppings = await Toppings.findAll({
      where: { restaurantsId: req.user.restaurantsId },
    });

    res.status(200).json({ toppings });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching toppings", error });
  }
};

// Get a topping by ID
exports.getToppingById = async (req, res) => {
  if (!req.ability.can("read", "Toppings")) {
    return res.status(403).json({ msg: "Permission denied to read toppings" });
  }
  const { id } = req.params;

  try {
    const topping = await Toppings.findByPk(id);
    if (!topping) {
      return res.status(404).json({ msg: "Topping not found" });
    }

    res.status(200).json({ topping });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching topping", error });
  }
};

// Update a topping
exports.updateTopping = async (req, res) => {
  if (!req.ability.can("edite", "Toppings")) {
    return res.status(403).json({ msg: "Permission denied to edit toppings" });
  }
  const { id } = req.params;
  const result = updateToppingSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path[0]}: ${err.message}`
    );
    return res.status(400).json({ errors });
  }

  const { name } = result.data;

  try {
    // Find topping by ID
    const topping = await Toppings.findByPk(id);

    if (!topping) {
      return res.status(404).json({ msg: "Topping not found" });
    }

    // Update topping details
    topping.name = name || topping.name;

    await topping.save();

    res.status(200).json({ msg: "Topping updated successfully", topping });
  } catch (error) {
    res.status(500).json({ msg: "Error updating topping", error });
  }
};

// Delete a topping
exports.deleteTopping = async (req, res) => {
  if (!req.ability.can("delete", "Toppings")) {
    return res.status(403).json({ msg: "Permission denied to edit toppings" });
  }
  const { id } = req.params;

  try {
    // Find topping by ID
    const topping = await Toppings.findByPk(id);

    if (!topping) {
      return res.status(404).json({ msg: "Topping not found" });
    }

    // Delete topping
    await topping.destroy();

    res.status(200).json({ msg: "Topping deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting topping", error });
  }
};
