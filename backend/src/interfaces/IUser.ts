import mongoose, { Types } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  number: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

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
