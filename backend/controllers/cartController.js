const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    if (product.stock < quantity)
      return res.status(400).json({ message: "Stok tidak cukup" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (product.stock < newQty)
        return res.status(400).json({ message: "Stok tidak cukup" });
      existingItem.quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        productName: product.name,
        productImage: product.image?.url || "",
        price: product.price,
        quantity,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1)
      return res.status(400).json({ message: "Quantity minimal 1" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    if (product.stock < quantity)
      return res.status(400).json({ message: "Stok tidak cukup" });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
      return res.status(404).json({ message: "Cart tidak ditemukan" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item)
      return res.status(404).json({ message: "Produk tidak ada di cart" });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: "Cart berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
      return res.status(404).json({ message: "Cart tidak ditemukan" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };