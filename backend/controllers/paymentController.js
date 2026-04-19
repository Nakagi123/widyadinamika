const xenditClient = require("../utils/xendit");
const Order = require("../models/Order");
const Product = require("../models/Product");

const { Invoice } = xenditClient;

const checkout = async (req, res, next) => {
  try {
    const { items, paymentMethod } = req.body;

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
      paymentMethod,
      xenditExternalId: externalId,
      status: "pending",
    });

    if (paymentMethod === "cash") {
      return res.status(201).json({
        message: "Pesanan dibuat. Tunjukkan ID pesanan ke kasir.",
        orderId: order._id,
        totalPrice,
      });
    }

    const xenditInvoice = await Invoice.createInvoice({
      data: {
        externalId,
        amount: totalPrice,
        description: `Pembayaran Order #${order._id}`,
        invoiceDuration: 86400,
        currency: "IDR",
        payerEmail: `user-${req.user.id}@test.com`,
        successRedirectUrl: process.env.XENDIT_SUCCESS_REDIRECT,
        failureRedirectUrl: process.env.XENDIT_FAILURE_REDIRECT,
      },
    });

    order.xenditInvoiceId = xenditInvoice.id;
    order.invoiceUrl = xenditInvoice.invoiceUrl;
    await order.save();

    return res.status(201).json({
      invoiceUrl: xenditInvoice.invoiceUrl,
      expiryDate: xenditInvoice.expiryDate,
      orderId: order._id,
    });

  } catch (err) {
    next(err);
  }
};

const kasirGetAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = { paymentMethod: "cash" };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("user", "username")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const kasirUpdateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["paid", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });
    if (order.paymentMethod !== "cash")
      return res.status(400).json({ message: "Hanya order cash yang bisa dikonfirmasi kasir" });
    if (order.status !== "pending")
      return res.status(400).json({ message: `Order sudah berstatus ${order.status}` });

    order.status = status;

    if (status === "paid") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    await order.save();
    res.json({ message: `Order berhasil diubah menjadi ${status}`, order });
  } catch (err) {
    next(err);
  }
};

const handleNotification = async (req, res, next) => {
  try {
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

module.exports = {
  checkout,
  handleNotification,
  getMyOrders,
  kasirGetAllOrders,
  kasirUpdateStatus,
};