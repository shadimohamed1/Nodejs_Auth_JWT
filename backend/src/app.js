import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import { UserRepository } from "./repositories/userRepository.js";
import { AuthController } from "./controllers/authController.js";
import { UserController } from "./controllers/userController.js";
import { createApiRouter } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

export function createApp({ userRepository = new UserRepository() } = {}) {
  const authController = new AuthController(userRepository);
  const userController = new UserController(userRepository);

  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true
    })
  );
  app.use(cookieParser());

  app.use("/api", createApiRouter({ authController, userController }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
