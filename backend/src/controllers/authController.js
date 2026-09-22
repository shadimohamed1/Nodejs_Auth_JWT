import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export class AuthController {
  constructor(userRepository) {
    this.userRepository = userRepository;
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

      const token = jwt.sign(
        {
          sub: user.id,
          role: user.role
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: "lax",
        maxAge: config.cookieMaxAge
      });

      return res.status(200).json({ message: "User signed in successfully" });
    } catch (error) {
      next(error);
    }
  };

  logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  };
}
