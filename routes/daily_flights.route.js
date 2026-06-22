// routes/items.js
const express = require("express");
const router = express.Router();
const {
  find,
  findOne,
  update,
  create,
  remove,
  daily,
  weekly,
  monthly,
  year,
  actived,
  forced,
} = require("../controllers/daily_flights.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

router.get("/", find);
router.get("/daily", daily);
router.get("/weekly", weekly);
router.get("/monthly", monthly);
router.get("/year", year);
router.get("/:id", findOne);
router.put("/:id", update);
router.put("/active/:id", actived);
router.put("/force/:id", forced);
router.post("/", create);
router.delete("/:id", remove);

module.exports = router;
