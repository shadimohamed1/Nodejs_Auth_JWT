import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  isProduction: process.env.NODE_ENV === "production",
  jwtExpiresIn: "1h",
  cookieMaxAge: 15 * 60 * 1000 // 15 minutes
};
