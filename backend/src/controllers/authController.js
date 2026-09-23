import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export class AuthController {
  constructor(userRepository, refreshTokenRepository) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  generateAccessToken(user) {
    return jwt.sign(
      { sub: user.id, role: user.role },
      config.jwtAccessSecret,
      { expiresIn: config.accessTokenExpiresIn }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        jti: crypto.randomUUID()
      },
      config.jwtRefreshSecret,
      { expiresIn: config.refreshTokenExpiresIn }
    );
  }

  setTokenCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: "lax",
      maxAge: config.accessTokenCookieMaxAge
    });

    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: "lax",
        path: "/api",
        maxAge: config.refreshTokenCookieMaxAge
      });
    }
  }

  signup = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await this.userRepository.create({
        email,
        passwordHash,
        role: "USER"
      });

      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  };

  signin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      await this.refreshTokenRepository.save(refreshToken);
      this.setTokenCookies(res, accessToken, refreshToken);

      return res.status(200).json({ message: "User signed in successfully" });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          message: "Refresh token missing",
          code: "REFRESH_TOKEN_MISSING"
        });
      }

      const tokenExists = await this.refreshTokenRepository.exists(refreshToken);
      if (!tokenExists) {
        return res.status(403).json({
          message: "Refresh token revoked or invalid",
          code: "REFRESH_TOKEN_REVOKED"
        });
      }

      let payload;
      try {
        payload = jwt.verify(refreshToken, config.jwtRefreshSecret);
      } catch (err) {
        await this.refreshTokenRepository.delete(refreshToken);
        return res.status(403).json({
          message: "Invalid or expired refresh token",
          code: "REFRESH_TOKEN_INVALID"
        });
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        await this.refreshTokenRepository.delete(refreshToken);
        return res.status(404).json({ message: "User not found" });
      }

      // Refresh Token Rotation: Delete used token, issue fresh pair
      await this.refreshTokenRepository.delete(refreshToken);
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      await this.refreshTokenRepository.save(newRefreshToken);

      this.setTokenCookies(res, newAccessToken, newRefreshToken);

      return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await this.refreshTokenRepository.delete(refreshToken);
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken", { path: "/api" });

      return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      next(error);
    }
  };
}
