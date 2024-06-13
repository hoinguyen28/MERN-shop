var express = require("express");
var router = express.Router();

const { checkAdmin, verifyToken } = require("../middleware/authMiddleware");
const { getUser, getAllUser, updateCart, getListUser, deleteUsers, updateAccount, updateRole, getTotalUsers  } = require("../controllers/userController");

// READ
// router.get("/:id", verifyToken, getUser);
// router.get("/:id", checkAdmin, getUser);
// router.get("/", checkAdmin, getAllUser);

router.get("/:id", getUser);
router.get("/total", getTotalUsers );
router.get("/", checkAdmin, getAllUser);
router.post("/list-user", getListUser);

router.delete("/deletemany", checkAdmin, deleteUsers);

// Update Cart
router.patch("/cart/update", verifyToken, updateCart);
router.patch("/:userId/changerole", checkAdmin, updateRole);
router.patch("/:userId/update", verifyToken, updateAccount);

module.exports = router;
