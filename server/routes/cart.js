const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", removeFromCart);

module.exports = router;
