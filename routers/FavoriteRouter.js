// create router to favorite a movie by id and delete favorite by id and movie id and edit favorite by id and movie id
const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/FavoriteController");

const { authenticate } = require("../middleware/authenticate");

router.post("/:id", authenticate, FavoriteController.createFavorite);
router.delete("/:id", authenticate, FavoriteController.destroyFavorite);
router.get("/", authenticate, FavoriteController.getMyFavorite);

module.exports = router;
