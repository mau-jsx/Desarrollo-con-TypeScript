// src/services/equipo.service.ts
import Equipo, { IEquipo } from "../models/equipo";
import User, { IUser } from "../models/usuario";

export const getEquipos = async (userId: string, rol: string) => {
  if (rol === "admin") {
    return await Equipo.find().populate("responsable", "nombre email");
  }
  return await Equipo.find({ responsable: userId }).populate(
    "responsable",
    "nombre email"
  );
};

export const createEquipo = async (
  data: Omit<IEquipo, "responsable">,
  responsableId: string
) => {
  const user = await User.findById<IUser>(responsableId);
  if (!user) throw new Error("Responsable no encontrado");

  const equipo = new Equipo({ ...data, responsable: responsableId });
  return await equipo.save();
};

export const deleteEquipo = async (id: string) => {
  const equipo = await Equipo.findByIdAndDelete(id);
  if (!equipo) throw new Error("Equipo no encontrado");
  return equipo;
};
