import { Router } from "express";
import {
  loginController,
  registerController,
} from "../Controladores/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post("/login", loginController);

router.post("/register", authMiddleware, adminMiddleware, registerController);

export default router;
