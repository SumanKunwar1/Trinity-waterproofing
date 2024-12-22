import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAddress {
  _id: Types.ObjectId;
  street: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  country: string;
  default: boolean;
}
interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  number: string;
  password: string;
  role: string;
  addressBook: IAddress[];
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
    addressBook: {
      type: [
        {
          street: { type: String, required: true },
          city: { type: String, required: true },
          province: { type: String, required: true },
          district: { type: String, required: true },
          postalCode: { type: String, required: true },
          country: { type: String, required: true },
          default: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
