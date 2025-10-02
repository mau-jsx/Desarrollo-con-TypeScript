import User from "../models/usuario";
import { JWT_SECRET } from "../config/env";
import { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Credenciales inválidas");

  const isValid = await compare(password, user.password);
  if (!isValid) throw new Error("Credenciales inválidas");

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en .env");
  }

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  };
};

export const register = async (
  nombre: string,
  email: string,
  password: string,
  rol: "admin" | "user" = "user"
) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("El email ya está registrado");

  const newUser = new User({ nombre, email, password, rol });
  await newUser.save();

  return {
    id: newUser._id.toString(), // 👈 También string
    nombre,
    email,
    rol,
  };
};
