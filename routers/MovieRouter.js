// create movie router
const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/MovieController");
const {
  authenticate,
  authenticateAdmin,
} = require("../middleware/authenticate");

router.get("/", MovieController.getMovies);
router.get("/filter", MovieController.filterMovies);
router.get("/search", MovieController.searchMovie);
router.get("/search/cast", MovieController.searchMovieByCast);
router.get("/:id", MovieController.getMovieById);
router.post("/", authenticateAdmin, MovieController.createMovie);
router.put("/:id", authenticateAdmin, MovieController.updateMovie);
router.delete("/:id", authenticateAdmin, MovieController.deleteMovie);

module.exports = router;
