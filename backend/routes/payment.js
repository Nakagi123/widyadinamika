const express = require("express");
const router = express.Router();
const { checkout, handleNotification, getMyOrders } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");

router.post("/checkout", authMiddleware, checkout);
router.post("/notification", handleNotification); // webhook Midtrans, tanpa auth
router.get("/orders", authMiddleware, getMyOrders);

module.exports = router;
