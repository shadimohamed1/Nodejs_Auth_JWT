import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "default_access_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  isProduction: process.env.NODE_ENV === "production",
  accessTokenExpiresIn: "15m",
  refreshTokenExpiresIn: "7d",
  accessTokenCookieMaxAge: 15 * 60 * 1000, // 15 minutes
  refreshTokenCookieMaxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};
