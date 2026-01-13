export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  // Normalize common error shapes
  const message = err.message || "Server Error";

  // JWT errors should be treated as auth errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Mongo duplicate key (unique index) errors
  if (err?.code === 11000) {
    return res.status(409).json({
      message: "Duplicate entry (you may have already placed a bid)"
    });
  }

  res.status(statusCode).json({ message });
};
