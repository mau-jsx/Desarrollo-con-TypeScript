import { Router } from "express";
import {
  getEquiposController,
  createEquipoController,
  deleteEquipoController,
  updateEquipoController, // ← nuevo
} from "../Controladores/equipo.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.get("/", authMiddleware, getEquiposController);
router.post("/", authMiddleware, createEquipoController);
router.put("/:id", authMiddleware, updateEquipoController);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEquipoController);

export default router;
