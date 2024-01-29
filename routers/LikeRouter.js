// create router to like a movie by id and delete like by id and movie id and edit like by id and movie id
const express = require("express");
const router = express.Router();
const LikeController = require("../controllers/LikeController");
const { authenticate } = require("../middleware/authenticate");

router.post("/:id", authenticate, LikeController.createLike);
router.put("/:id", authenticate, LikeController.updateLike);

module.exports = router;
