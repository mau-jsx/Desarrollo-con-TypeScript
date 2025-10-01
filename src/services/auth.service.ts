import User from "../models/usuario";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto";

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Credenciales inválidas");

  const isValid = await compare(password, user.password);
  if (!isValid) throw new Error("Credenciales inválidas");

  const token = sign(
    { id: user._id, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
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

  return { id: newUser._id, nombre, email, rol };
};
