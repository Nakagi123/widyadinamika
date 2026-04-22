module.exports = (req, res, next) => {
  if (req.user.role !== "kasir") {
    return res.status(403).json({ message: "Akses ditolak. Hanya kasir." });
  }
  next();
};