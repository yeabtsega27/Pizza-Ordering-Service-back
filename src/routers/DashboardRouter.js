const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middleware/auth");

// Single route to get all dashboard metrics
router.get("/", auth, dashboardController.getDashboardMetrics);

module.exports = router;
