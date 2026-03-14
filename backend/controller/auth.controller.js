import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateAuthToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  const { fullname, username, email, password } = req.body;
  try {
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "user already exists" });
    }
    const user = await User.create({ fullname, username, email, password });

    const { accessToken, refreshToken } = generateAuthToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: "user created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("🔐 Login attempt started");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);

    const { username, password } = req.body;

    if (!username || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Test MongoDB connection
    console.log("Checking MongoDB connection...");
    if (mongoose.connection.readyState !== 1) {
      console.log("❌ MongoDB not connected");
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    console.log("Finding user:", username);
    const user = await User.findOne({ username });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    console.log("Comparing password...");
    const isPasswordValid = await user.comparePassword(password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    console.log("Generating tokens...");
    const { accessToken, refreshToken } = generateAuthToken(user._id);

    console.log("Storing refresh token...");
    await storeRefreshToken(user._id, refreshToken);

    console.log("Setting cookies...");
    setCookies(res, accessToken, refreshToken);

    console.log("✅ Login successful for:", username);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
        hasVote: user.hasVote,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("❌ Login error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "unauthorized" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await redis.del(`refreshToken:${decoded.userId}`);
    } catch (error) {
      // Token is invalid, but we still want to clear cookies
      console.log("Invalid refresh token during logout:", error.message);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const userId = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!userId) {
      return res.status(401).json({ message: "unauthorized, user not found" });
    }
    const storedToken = await redis.get(`refreshToken:${userId.userId}`);
    if (!storedToken) {
      return res.status(401).json({ message: "No refresh token stored" });
    }

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: userId.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
