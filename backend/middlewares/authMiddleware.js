import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Coach from "../models/coachModel.js";
import Admin from "../models/adminModel.js";

const protect = asyncHandler(async (req, res, next) => {
  const userAccessToken = req.headers["useraccesstoken"];

  try {
    const decoded = jwt.verify(
      userAccessToken,
      process.env.JWT_USER_ACCESS_TOKEN_SECRET
    );

    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    let userRefreshToken = req.headers["userrefreshtoken"];

    if (!userRefreshToken) {
      res.status(401);
      throw new Error("No refresh token provided");
    }

    try {
      const decoded = jwt.verify(
        userRefreshToken,
        process.env.JWT_USER_REFRESH_TOKEN_SECRET
      );

      req.user = await User.findById(decoded.userId).select("-password");

      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_USER_ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      res.cookie("userAccessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid refresh token");
    }
  }
});

const protectCoach = asyncHandler(async (req, res, next) => {
  const coachAccessToken = req.headers["coachaccesstoken"];

  try {
    const decoded = jwt.verify(
      coachAccessToken,
      process.env.JWT_COACH_ACCESS_TOKEN_SECRET
    );

    req.coach = await Coach.findById(decoded.coachId).select("-password");

    next();
  } catch (error) {
    const coachRefreshToken = req.headers["coachrefreshtoken"];

    if (!coachRefreshToken) {
      res.status(401);
      throw new Error("No refresh token provided");
    }

    try {
      const decoded = jwt.verify(
        coachRefreshToken,
        process.env.JWT_COACH_REFRESH_TOKEN_SECRET
      );

      req.coach = await Coach.findById(decoded.coachId).select("-password");

      const newAccessToken = jwt.sign(
        { coachId: decoded.coachId },
        process.env.JWT_COACH_ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      res.cookie("coachAccessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid Refresh token");
    }
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  const adminAccessToken = req.headers["adminaccesstoken"];

  try {
    const decoded = jwt.verify(
      adminAccessToken,
      process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET
    );

    req.admin = await Admin.findById(decoded.adminId).select("-password");

    next();
  } catch (error) {
    const adminRefreshToken = req.headers["adminrefreshtoken"];

    if (!adminRefreshToken) {
      res.status(401);
      throw new Error("No refresh token provided");
    }

    try {
      const decoded = jwt.verify(
        adminRefreshToken,
        process.env.JWT_ADMIN_REFRESH_TOKEN_SECRET
      );

      req.admin = await Admin.findById(decoded.adminId).select("-password");

      const newAccessToken = jwt.sign(
        { adminId: decoded.adminId },
        process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      res.cookie("adminAccessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid Refresh Token");
    }
  }
});

export { protect, protectCoach, protectAdmin };
