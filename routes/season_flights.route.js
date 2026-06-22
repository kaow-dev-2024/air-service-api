// routes/items.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}.xlsx`);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();
const {
  find,
  findOne,
  update,
  create,
  remove,
  generateDailyBySeasonIds,
  unGenerateDailyBySeasonIds,
  downloadSeasonFlightImportTemplate,
  importFileSeasonSchedule,
} = require("../controllers/season_flights.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

router.get("/", find);
router.get("/import-template", downloadSeasonFlightImportTemplate);
router.get("/:id", findOne);
router.put("/:id", update);
router.post("/", create);
router.delete("/:id", remove);
router.post("/generate-daily", generateDailyBySeasonIds);
router.post("/ungenerate-daily", unGenerateDailyBySeasonIds);
router.post("/import", upload.single("file"), importFileSeasonSchedule);

module.exports = router;
