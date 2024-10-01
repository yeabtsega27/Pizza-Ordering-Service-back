// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/UsersController");
const auth = require("../middleware/auth");
const router = express.Router();

// Register a new user
router.post("/register", userController.registerUser);

// Login a user
router.post("/login", userController.loginUser);

// Register a new restaurant manager
router.post(
  "/restaurant/adduser",
  auth,
  userController.registerRestaurantManager
);

// Get all users
router.get("/restaurant", auth, userController.getAllUsers);

// Get a single restaurant user by ID
router.get("/restaurant/:id", auth, userController.getRestaurantUserById);

// Get a single user by ID
router.get("/:id", auth, userController.getUserById);

// Update a user
router.put("/:id", auth, userController.updateUser);

// Update a user
router.put("/restaurant/:id", auth, userController.updateRestaurantUser);

// Delete a user
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
