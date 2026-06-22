// routes/items.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".bin";
    callback(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();
const {
  uploadSingle,
  uploadMultiple,
} = require("../controllers/uploads.controller");
const authMiddleware = require("../middleware/authMiddleware");
// Apply auth middleware to all routes in this router
router.use(authMiddleware);

router.post("/single", upload.single("file"), uploadSingle);

router.post("/multiple", upload.array("files", 10), uploadMultiple);

module.exports = router;
