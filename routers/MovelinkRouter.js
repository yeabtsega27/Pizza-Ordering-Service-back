// create route to add movie link by movie id remove movie link by movie id and edit movie link by movie id
const express = require("express");
const router = express.Router();
const MovieLinkController = require("../controllers/movelinkController");
const { authenticateAdmin } = require("../middleware/authenticate");

router.post("/:id", authenticateAdmin, MovieLinkController.createMovieLink);
router.delete("/:id", authenticateAdmin, MovieLinkController.destroyMovieLink);
router.put("/:id", authenticateAdmin, MovieLinkController.updateMovieLink);

module.exports = router;
