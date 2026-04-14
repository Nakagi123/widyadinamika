const xenditClient = require("../utils/xendit");
const Order = require("../models/Order");
const Product = require("../models/Product");

const { Invoice } = xenditClient;

// POST /api/payment/checkout  (butuh token)
const checkout = async (req, res, next) => {
  try {
    const { items } = req.body;

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: `Produk ${item.productId} tidak ditemukan` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Stok ${product.name} tidak cukup` });

      totalPrice += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const externalId = `ORDER-${Date.now()}-${req.user.id}`;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      xenditExternalId: externalId,
    });

    // Buat invoice ke Xendit (syntax v7)
    const xenditInvoice = await Invoice.createInvoice({
      data: {
        externalId,
        amount: totalPrice,
        description: `Pembayaran Order #${order._id}`,
        invoiceDuration: 86400, // expired dalam 24 jam (detik)
        currency: "IDR",
        successRedirectUrl: process.env.XENDIT_SUCCESS_REDIRECT,
        failureRedirectUrl: process.env.XENDIT_FAILURE_REDIRECT,
      },
    });

    order.xenditInvoiceId = xenditInvoice.id;
    order.invoiceUrl = xenditInvoice.invoiceUrl;
    await order.save();

    res.json({
      invoiceUrl: xenditInvoice.invoiceUrl,
      expiryDate: xenditInvoice.expiryDate,
      orderId: order._id,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payment/notification  (webhook dari Xendit)
const handleNotification = async (req, res, next) => {
  try {
    // Verifikasi callback token dari header Xendit
    const callbackToken = req.headers["x-callback-token"];
    if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN)
      return res.status(403).json({ message: "Token tidak valid" });

    const { external_id, status } = req.body;

    const order = await Order.findOne({ xenditExternalId: external_id });
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    if (status === "PAID" || status === "SETTLED") {
      order.status = "paid";
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    } else if (status === "EXPIRED") {
      order.status = "cancelled";
    }

    await order.save();
    res.json({ message: "Notifikasi diterima" });
  } catch (err) {
    next(err);
  }
};

// GET /api/payment/orders  (riwayat order, butuh token)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

module.exports = { checkout, handleNotification, getMyOrders };