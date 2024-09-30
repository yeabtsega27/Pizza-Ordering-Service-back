const express = require("express");
const toppingController = require("../controllers/ToppingController");
const auth = require("../middleware/auth");

const router = express.Router();

// Topping management routes
router.post("/create", auth, toppingController.createTopping);
router.get("/restaurant", auth, toppingController.getAllToppings);
router.get("/:id", toppingController.getToppingById);
router.put("/edit/:id", toppingController.updateTopping);
router.delete("/:id", toppingController.deleteTopping);

module.exports = router;
