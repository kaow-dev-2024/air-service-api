// routes/items.js
const express = require("express");
const router = express.Router();
const {
  find,
  findOne,
  update,
  create,
  remove
} = require("../controllers/airports.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

router.get("/", find);
router.get("/:id", findOne);
router.put("/:id", update);
router.post("/", create);
router.delete("/:id", remove);

module.exports = router;
