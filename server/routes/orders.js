const express = require("express");
const {
  placeOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", placeOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

module.exports = router;
