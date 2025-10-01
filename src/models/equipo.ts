import { Schema, model, Model } from "mongoose";

export interface IEquipo {
  nombre: string;
  modelo: string;
  estado: "activo" | "inactivo" | "en_reparacion";
  ubicacion: string;
  fechaAdquisicion?: Date;
  responsable: Schema.Types.ObjectId;
}

const equipoSchema = new Schema<IEquipo>(
  {
    nombre: { type: String, required: true },
    modelo: { type: String, required: true },
    estado: {
      type: String,
      enum: ["activo", "inactivo", "en_reparacion"],
      default: "activo",
    },
    ubicacion: { type: String, required: true },
    fechaAdquisicion: { type: Date, default: Date.now },
    responsable: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Equipo = model<IEquipo>("Equipo", equipoSchema);
export default Equipo;
