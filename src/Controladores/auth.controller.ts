// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { login, register } from "../services/auth.service";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son requeridos." });
  }

  try {
    const result = await login(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res
      .status(401)
      .json({ error: err.message || "Error en la autenticación." });
  }
};

export const registerController = async (req: Request, res: Response) => {
  const { nombre, email, password, rol = "user" } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nombre, email y contraseña son requeridos." });
  }

  if (rol !== "admin" && rol !== "user") {
    return res
      .status(400)
      .json({ error: 'Rol inválido. Debe ser "admin" o "user".' });
  }

  try {
    const newUser = await register(nombre, email, password, rol);
    res
      .status(201)
      .json({ message: "Usuario registrado exitosamente.", user: newUser });
  } catch (err: any) {
    if (err.message === "El email ya está registrado") {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};
