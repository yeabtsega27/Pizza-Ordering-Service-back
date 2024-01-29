// create episode router to create episode delete episode and edit episode
const express = require("express");
const router = express.Router();

const EpisodeController = require("../controllers/EpisodeController");
const { authenticateAdmin } = require("../middleware/authenticate");

router.post("/:id", authenticateAdmin, EpisodeController.createEpisode);
router.delete("/:id", authenticateAdmin, EpisodeController.destroyEpisode);
router.put("/:id", authenticateAdmin, EpisodeController.updateEpisode);

module.exports = router;
