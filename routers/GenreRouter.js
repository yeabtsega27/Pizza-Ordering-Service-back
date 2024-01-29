// create Genre Router
const express = require("express");
const router = express.Router();
const GenreController = require("../controllers/GenreController");
const {
  authenticate,
  authenticateAdmin,
} = require("../middleware/authenticate");

router.post("/", authenticateAdmin, GenreController.createGenre);
router.get("/", authenticateAdmin, GenreController.getGenres);
router.get("/:id", authenticateAdmin, GenreController.getGenre);
router.put("/:id", authenticateAdmin, GenreController.updateGenre);
router.delete("/:id", authenticateAdmin, GenreController.destroyGenre);

module.exports = router;
