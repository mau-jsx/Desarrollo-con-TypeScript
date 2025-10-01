import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.rol !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado. Se requiere rol de administrador." });
  }
  next();
};
