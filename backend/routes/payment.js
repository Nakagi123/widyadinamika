const express = require("express");
const router = express.Router();
const {
  checkout,
  handleNotification,
  getMyOrders,
  kasirGetAllOrders,
  kasirUpdateStatus,
  deleteOrder,
  checkPaymentStatus,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");
const kasirMiddleware = require("../middleware/kasir");

// User
router.post("/checkout", authMiddleware, checkout);
router.get("/orders", authMiddleware, getMyOrders);

// Payment status polling
router.get("/check-status/:orderId", authMiddleware, checkPaymentStatus);

// Webhook Xendit
router.post("/notification", handleNotification);

// Kasir
router.get("/kasir/orders", authMiddleware, kasirMiddleware, kasirGetAllOrders);
router.patch("/kasir/confirm/:orderId", authMiddleware, kasirMiddleware, kasirUpdateStatus);
router.delete("/order/:orderId", authMiddleware, kasirMiddleware, deleteOrder);

module.exports = router;