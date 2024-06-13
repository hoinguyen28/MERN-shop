const { likeProduct, getProductById,getTopThreeBestSellingProducts, getFeedProduct, getListItem, updateProduct, deleteProducts, deleteProductById, updateQuantities, addComment, searchPd, getTotalProducts  } = require("../controllers/productController.js");
const { verifyToken, checkAdmin } = require("../middleware/authMiddleware.js");
var express = require("express");
const router = express.Router();

/* READ */
router.get("/", getFeedProduct);
router.get("/top", getTopThreeBestSellingProducts);
router.get("/total", getTotalProducts );
router.post("/list-item", getListItem);
router.get("/search", searchPd);
// /search 

router.delete("/deletemany", checkAdmin, deleteProducts);
router.patch("/update-quantity", updateQuantities);

router.patch("/:productId/comment", verifyToken, addComment);

router.get("/:productId", getProductById);
router.patch("/:productId", checkAdmin, updateProduct);
router.delete("/:productId", checkAdmin, deleteProductById);

/* UPDATE */

router.patch("/:id/like", verifyToken, likeProduct);

module.exports = router;
