import { Router } from "express";
import { createAuthRoutes } from "./authRoutes.js";
import { createUserRoutes } from "./userRoutes.js";

export function createApiRouter({ authController, userController }) {
  const router = Router();

  router.use(createAuthRoutes(authController));
  router.use(createUserRoutes(userController));

  return router;
}
