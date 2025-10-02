import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

interface JwtPayload {
  id: string;
  email: string;
  rol: "admin" | "user";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token no proporcionado o formato inválido." });
  }

  const token = authHeader.substring(7);

  if (!JWT_SECRET) {
    return res
      .status(500)
      .json({ error: "Error interno: JWT_SECRET no configurado." });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("Error JWT:", err.message); // ← Verás el error real
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};
