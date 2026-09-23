import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function authenticateToken(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      code: "TOKEN_MISSING"
    });
  }

  try {
    const payload = jwt.verify(token, config.jwtAccessSecret);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        code: "TOKEN_EXPIRED"
      });
    }

    return res.status(401).json({
      message: "Invalid access token",
      code: "TOKEN_INVALID"
    });
  }
}

export function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

export const requireAdminRole = requireRole("ADMIN");
