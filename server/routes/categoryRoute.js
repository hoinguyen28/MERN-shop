const { createCategory, getCategory } = require("../controllers/categoryController");
var express = require("express");
const { checkAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

/* READ */
router.get("/", getCategory);
router.post("/", checkAdmin, createCategory);
/* UPDATE */

module.exports = router;
