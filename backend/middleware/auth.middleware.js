import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const accessToken = req.cookies.accessToken;

    console.log("🔐 Auth check - Token present:", !!accessToken);

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "unauthorized - Access Denied",
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      console.log("✅ Token verified for user:", decoded.userId);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "unauthorized - user not found",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "unauthorized - Access Token Expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "unauthorized - Invalid Token",
      });
    }
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden - Access Denied",
    });
  }
};
