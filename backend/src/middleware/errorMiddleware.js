export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
}
