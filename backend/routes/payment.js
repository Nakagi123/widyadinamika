const express = require("express");
const router = express.Router();
const {
  checkout,
  handleNotification,
  getMyOrders,
  kasirGetAllOrders,
  kasirUpdateStatus,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");
const kasirMiddleware = require("../middleware/kasir");

// User
router.post("/checkout", authMiddleware, checkout);
router.get("/orders", authMiddleware, getMyOrders);

// Webhook Xendit
router.post("/notification", handleNotification);

// Kasir
router.get("/kasir/orders", authMiddleware, kasirMiddleware, kasirGetAllOrders);
router.patch("/kasir/confirm/:orderId", authMiddleware, kasirMiddleware, kasirUpdateStatus);

module.exports = router;