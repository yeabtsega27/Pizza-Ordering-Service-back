const express = require("express");
const router = express.Router();
const MovieGenreController = require("../controllers/MovieGenreController");
const { authenticate } = require("../middleware/authenticate");

router.post("/:id", authenticate, MovieGenreController.createMovieGener);
router.delete("/:id", authenticate, MovieGenreController.destroyMovieGener);

module.exports = router;
