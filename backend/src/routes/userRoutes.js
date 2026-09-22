import { Router } from "express";
import { authenticateToken, requireAdminRole } from "../middleware/authMiddleware.js";

export function createUserRoutes(userController) {
  const router = Router();

  router.get("/profile", authenticateToken, userController.getProfile);
  router.delete("/delete/:id", authenticateToken, requireAdminRole, userController.deleteUser);

  return router;
}
