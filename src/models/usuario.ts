import { Schema, model, Model } from "mongoose";
import { compare, hash } from "bcrypt";

export interface IUser {
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "user";
}

export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel>(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return compare(candidate, this.password);
};

const User = model<IUser, UserModel>("User", userSchema);
export default User;
