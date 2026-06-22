// routes/items.js
const express = require("express");
const router = express.Router();
const {
  filterSeasonFlights,
  filterDailyFlights,
  filterUsers,
} = require("../controllers/filters.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

router.post("/season-flights", filterSeasonFlights);
router.post("/daily-flights", filterDailyFlights);
router.post("/users", filterUsers);

module.exports = router;
