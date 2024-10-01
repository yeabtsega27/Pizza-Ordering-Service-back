const fs = require("fs");
const { Pizza, Toppings, Restaurants } = require("../../models");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  createPizzaSchema,
  editPizzaSchema,
  addRemoveToppingSchema,
} = require("../validations/pizzaValidation");
const { body } = require("express-validator");

// Create a new pizza
exports.createPizza = async (req, res) => {
  if (!req.ability.can("create", "Pizza")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to create pizza menu" });
  }
  const result = createPizzaSchema.safeParse({
    name: req.body.name,
    price: req.body.price,
    addedToppings: JSON.parse(req.body.addedToppings),
    selectedToppings: req.body.selectedToppings,
  });
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path[0]}: ${err.message}`
    );
    return res.status(400).json({ errors });
  }

  const { name, price, addedToppings, selectedToppings } = result.data;
  if (!req.files || !req.files.image) {
    return res.status(400).json({ msg: "pizza image is required" });
  }
  const image = req.files.image;

  const imageName = uuidv4() + image.name;
  const uploadPath = path.join(__dirname, "../uploads/", imageName);

  try {
    image.mv(uploadPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error while uploading logo image");
      }
      const newPizza = await Pizza.create({
        name,
        price,
        restaurantsId: req.user.restaurantsId,
        image: imageName,
      });

      selectedToppings.map(async (toppingId) => {
        const topping = await Toppings.findByPk(toppingId);
        await newPizza.addTopping(topping);
      });

      addedToppings.map(async (value) => {
        const existingTopping = await Toppings.findAll({
          where: { name: value.value, restaurantsId: req.user.restaurantsId },
        });
        if (existingTopping.length == 0) {
          const topping = await Toppings.create({
            name: value.value,
            restaurantsId: req.user.restaurantsId,
          });
          if (value.selected) {
            await newPizza.addTopping(topping);
          }
        }
      });

      const pizza = Pizza.findByPk(newPizza.id, {
        include: {
          model: Toppings,
          through: { attributes: [] }, // Exclude the join table attributes
        },
      });

      res.status(201).json({ msg: "Pizza created successfully", pizza });
    });
  } catch (error) {
    res.status(500).json({ msg: "Error creating pizza", error });
  }
};

// Edit pizza details
exports.editPizza = async (req, res) => {
  if (!req.ability.can("edite", "Pizza")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edit pizza menu" });
  }
  const result = editPizzaSchema.safeParse({
    name: req.body.name,
    price: req.body.price,
    newAddedToppings: JSON.parse(req.body.newAddedToppings),
    addedToppings: JSON.parse(req.body.addedToppings),
    removedToppings: JSON.parse(req.body.removedToppings),
  });
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path[0]}: ${err.message}`
    );
    return res.status(400).json({ errors });
  }

  const { id } = req.params;
  const { name, price, newAddedToppings, addedToppings, removedToppings } =
    result.data;

  try {
    const pizza = await Pizza.findByPk(id);

    if (!pizza) {
      return res.status(404).json({ msg: "Pizza not found" });
    }

    addedToppings.map(async (toppingId) => {
      const topping = await Toppings.findByPk(toppingId);
      await pizza.addTopping(topping);
    });

    removedToppings.map(async (toppingId) => {
      const topping = await Toppings.findByPk(toppingId);
      await pizza.removeTopping(topping);
    });

    newAddedToppings.map(async (value) => {
      const existingTopping = await Toppings.findAll({
        where: { name: value.value, restaurantsId: req.user.restaurantsId },
      });
      if (existingTopping.length == 0) {
        const topping = await Toppings.create({
          name: value.value,
          restaurantsId: req.user.restaurantsId,
        });
        if (value.selected) {
          await pizza.addTopping(topping);
        }
      }
    });

    if (req.files && req.files.image) {
      const image = req.files.image;

      const imageName = uuidv4() + image.name;
      const uploadPath = path.join(__dirname, "../uploads/", imageName);

      // Delete old logo file
      if (pizza.image) {
        const oldImagePath = path.join(__dirname, "../uploads/", pizza.image);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // delete old logo
        }

        await image.mv(uploadPath, async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error while uploading logo image");
          }
        });
        pizza.image = imageName;
      }
    }

    pizza.name = name || pizza.name;
    pizza.price = price || pizza.price;

    await pizza.save();

    res.status(200).json({ msg: "Pizza updated successfully", pizza });
  } catch (error) {
    res.status(500).json({ msg: "Error updating pizza", error });
  }
};

// Delete a pizza
exports.deletePizza = async (req, res) => {
  if (!req.ability.can("delete", "Pizza")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edit pizza menu" });
  }
  const { id } = req.params;

  try {
    const pizza = await Pizza.findByPk(id);

    if (!pizza) {
      return res.status(404).json({ msg: "Pizza not found" });
    }

    await pizza.destroy();

    res.status(200).json({ msg: "Pizza deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting pizza", error });
  }
};

// Add a topping to a pizza
exports.addToppingToPizza = async (req, res) => {
  if (!req.ability.can("edite", "Pizza")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edit pizza menu" });
  }
  const result = addRemoveToppingSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path[0]}: ${err.message}`
    );
    return res.status(400).json({ errors });
  }

  const { pizzaId, toppingId } = result.data;

  try {
    const pizza = await Pizza.findByPk(pizzaId);
    const topping = await Toppings.findByPk(toppingId);

    if (!pizza || !topping) {
      return res.status(404).json({ msg: "Pizza or Topping not found" });
    }

    await pizza.addTopping(topping);

    res.status(200).json({ msg: "Topping added to pizza successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error adding topping to pizza", error });
  }
};

// Remove a topping from a pizza
exports.removeToppingFromPizza = async (req, res) => {
  if (!req.ability.can("edite", "Pizza")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edit pizza menu" });
  }
  const result = addRemoveToppingSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path[0]}: ${err.message}`
    );
    return res.status(400).json({ errors });
  }

  const { pizzaId, toppingId } = result.data;

  try {
    const pizza = await Pizza.findByPk(pizzaId);
    const topping = await Toppings.findByPk(toppingId);

    if (!pizza || !topping) {
      return res.status(404).json({ msg: "Pizza or Topping not found" });
    }

    await pizza.removeTopping(topping);

    res.status(200).json({ msg: "Topping removed from pizza successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error removing topping from pizza", error });
  }
};

// Get all pizza for a restaurant
exports.getAllPizzasFromRestaurant = async (req, res) => {
  if (!req.ability.can("read", "Pizza")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edit pizza menu" });
  }

  try {
    const pizza = await Pizza.findAll({
      where: { restaurantsId: req.user.restaurantsId },
      include: {
        model: Toppings,
        through: { attributes: [] }, // Exclude the join table attributes
      },
    });

    res.status(200).json({ pizza });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching pizza", error });
  }
};

// Get all pizza for a restaurant
exports.getAllPizzas = async (req, res) => {
  try {
    const pizza = await Pizza.findAll({
      include: [Toppings, Restaurants],
    });

    res.status(200).json({ pizza });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching pizza", error });
  }
};

// Get a specific pizza by ID
exports.getPizzaById = async (req, res) => {
  const { id } = req.params;

  try {
    const pizza = await Pizza.findByPk(id, {
      include: {
        model: Toppings,
        through: { attributes: [] }, // Exclude the join table attributes
      },
    });

    res.status(200).json({ pizza });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching pizza", error });
  }
};
