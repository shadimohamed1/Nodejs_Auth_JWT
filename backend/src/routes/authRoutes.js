import { Router } from "express";

export function createAuthRoutes(authController) {
  const router = Router();

  router.post("/signup", authController.signup);
  router.post("/signin", authController.signin);
  router.post("/refresh", authController.refresh);
  router.post("/logout", authController.logout);

  return router;
}
