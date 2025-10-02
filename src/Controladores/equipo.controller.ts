import { Request, Response } from "express";
import {
  getEquipos,
  createEquipo,
  updateEquipo,
  deleteEquipo,
} from "../services/equipo.service";

// GET /api/equipos
export const getEquiposController = async (req: Request, res: Response) => {
  try {
    const equipos = await getEquipos(req.user!.id, req.user!.rol);
    res.status(200).json(equipos);
  } catch (err: any) {
    res.status(500).json({ error: "Error al obtener los equipos." });
  }
};

export const createEquipoController = async (req: Request, res: Response) => {
  const { nombre, modelo, estado, ubicacion, fechaAdquisicion } = req.body;

  if (!nombre || !modelo || !ubicacion) {
    return res
      .status(400)
      .json({ error: "Nombre, modelo y ubicación son requeridos." });
  }

  try {
    const equipo = await createEquipo(
      { nombre, modelo, estado, ubicacion, fechaAdquisicion },
      req.user!.id
    );
    res.status(201).json(equipo);
  } catch (err: any) {
    if (err.message === "Responsable no encontrado") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al crear el equipo." });
  }
};

export const updateEquipoController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID de equipo es requerido." });
  }

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ error: "Debe enviar al menos un campo para actualizar." });
  }

  try {
    const equipo = await updateEquipo(
      id,
      updateData,
      req.user!.id,
      req.user!.rol
    );
    res.status(200).json(equipo);
  } catch (err: any) {
    if (err.message === "Equipo no encontrado") {
      return res.status(404).json({ error: err.message });
    }
    if (
      err.message === "No tienes permiso para modificar este equipo" ||
      err.message === "No puedes cambiar el responsable del equipo"
    ) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al actualizar el equipo." });
  }
};

export const deleteEquipoController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID de equipo es requerido." });
  }

  try {
    await deleteEquipo(id);
    res.status(200).json({ message: "Equipo eliminado correctamente." });
  } catch (err: any) {
    if (err.message === "Equipo no encontrado") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al eliminar el equipo." });
  }
};
