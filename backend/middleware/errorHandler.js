const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server";

  res.status(statusCode).json({
    success: false,
    message,
    detail: err.response?.data || err.rawResponse || null,
  });
};

module.exports = errorHandler;
