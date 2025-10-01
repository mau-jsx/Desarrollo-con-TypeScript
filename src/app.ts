import * as express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as morgan from "morgan";

import authRoutes from "./Rutas/auth.routes";
import equipoRoutes from "./Rutas/equipo.routes";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/formotex_inventario";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/equipos", equipoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
