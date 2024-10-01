const express = require("express");
const pizzaController = require("../controllers/PizzaController");
const auth = require("../middleware/auth");

const router = express.Router();

// Route for creating a pizza
router.post("/create", auth, pizzaController.createPizza);

// Route for editing a pizza
router.put("/:id", auth, pizzaController.editPizza);

// Route for deleting a pizza
router.delete("/:id", auth, pizzaController.deletePizza);

// Route for adding a topping to a pizza
router.post("/topping/add", auth, pizzaController.addToppingToPizza);

// Route for removing a topping from a pizza
router.post("/topping/remove", auth, pizzaController.removeToppingFromPizza);

// Route for getting all pizzas for a specific restaurant
router.get("/restaurant", auth, pizzaController.getAllPizzasFromRestaurant);

// Route for getting all pizzas
router.get("/", pizzaController.getAllPizzas);

// Route for getting a specific pizza by ID
router.get("/:id", pizzaController.getPizzaById);

module.exports = router;
