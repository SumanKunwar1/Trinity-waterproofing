import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  fullName: string;
  email: string;
  number: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
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
