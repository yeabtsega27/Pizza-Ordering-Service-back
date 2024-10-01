const express = require("express");
const restaurantController = require("../controllers/restaurantsController");
const auth = require("../middleware/auth");

const router = express.Router();

// Route for creating a new restaurant and assigning the user as super admin
router.post("/create", restaurantController.createRestaurant);

// Route for getting restaurant(s)
router.get("/:id", restaurantController.getRestaurant);

router.get("/", restaurantController.getAllRestaurant);

// Route for updating a restaurant
router.put("/update/:id", auth, restaurantController.updateRestaurant);

// Route for deleting a restaurant
router.delete("/delete/:id", auth, restaurantController.deleteRestaurant);

module.exports = router;
