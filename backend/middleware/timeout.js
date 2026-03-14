// middleware/timeout.js
export const timeoutHandler = (req, res, next) => {
  // Set timeout for this request (8 seconds)
  req.setTimeout(8000, () => {
    console.error("❌ Request timeout:", req.path);
    res.status(504).json({
      success: false,
      message: "Request timeout. Please try again.",
    });
  });
  next();
};
