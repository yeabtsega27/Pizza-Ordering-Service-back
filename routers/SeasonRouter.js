// create router for season to create season delete season
const express = require("express");
const router = express.Router();
const SeasonController = require("../controllers/SeasonController");
const { authenticateAdmin } = require("../middleware/authenticate");

router.post("/:id", authenticateAdmin, SeasonController.createSeason);
router.delete("/:id", authenticateAdmin, SeasonController.destroySeason);
router.put("/:id", authenticateAdmin, SeasonController.updateSeason);

module.exports = router;
