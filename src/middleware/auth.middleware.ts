// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

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

  const token = authHeader.substring(7); // Quita "Bearer "

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu_secreto"
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};
