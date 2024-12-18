import mongoose, { Schema } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  number: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
