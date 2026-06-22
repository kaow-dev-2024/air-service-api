// routes/items.js
const express = require("express");
const router = express.Router();
const {
  find,
  findOne,
  create,
  update,
  remove,
  filter,
  changePassword,
} = require("../controllers/users.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

router.get("/", find);
router.get("/:id", findOne);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.post("/filter", filter);
router.post("/change-password", changePassword);

module.exports = router;
