import * as express from "express";
import mongoose from "mongoose";
import * as morgan from "morgan";
import { MONGO_URI } from "./config/env";
import authRoutes from "./Rutas/auth.routes";
import equipoRoutes from "./Rutas/equipo.routes";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar:", err));

app.use("/api/auth", authRoutes);
app.use("/api/equipos", equipoRoutes);

const PORT = parseInt(process.env.PORT || "3000");
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
