// src/routes/equipo.routes.ts
import { Router } from "express";
import {
  getEquiposController,
  createEquipoController,
  deleteEquipoController,
} from "../Controladores/equipo.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.get("/", authMiddleware, getEquiposController);

router.post("/", authMiddleware, createEquipoController);

router.delete("/:id", authMiddleware, adminMiddleware, deleteEquipoController);

export default router;
