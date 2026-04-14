const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");
const { uploadToCloudinary } = require("../middleware/upload");

// GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("createdBy", "username");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "username");
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products  (butuh token + gambar)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;

    let image = { url: "", publicId: "" };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "products");
      image = { url: result.secure_url, publicId: result.public_id };
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      image,
      createdBy: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id  (butuh token)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    const { name, description, price, stock } = req.body;

    // Kalau ada gambar baru, hapus yang lama dari Cloudinary
    if (req.file) {
      if (product.image.publicId) {
        await cloudinary.uploader.destroy(product.image.publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, "products");
      product.image = { url: result.secure_url, publicId: result.public_id };
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id  (butuh token)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    // Hapus gambar dari Cloudinary
    if (product.image.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId);
    }

    await product.deleteOne();
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
