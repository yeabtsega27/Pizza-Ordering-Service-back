const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/OrdersController");
const auth = require("../middleware/auth");

// Create a new order
router.post("/create", auth, ordersController.createOrder);

// Get all orders
router.get("/restaurant", auth, ordersController.getAllOrdersByRestaurant);

// Get orders by userId
router.get("/myorder", auth, ordersController.getOrdersByUserId);

// Get order by ID
router.get("/:id", auth, ordersController.getOrderById);

// Update order status
router.put("/:id", auth, ordersController.updateOrder);

// Delete an order
router.delete("/:id", auth, ordersController.deleteOrder);

module.exports = router;
