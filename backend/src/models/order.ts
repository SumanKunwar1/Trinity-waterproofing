import mongoose, { Schema, Document, Types } from "mongoose";
import { IOrderItem, IAddress } from "../interfaces";
import { OrderStatus } from "../config/orderStatusEnum";

export interface IOrder extends Document {
  products: IOrderItem[];
  userId: Types.ObjectId;
  AddressId: IAddress;
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  reason: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema: Schema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        color: { type: String, required: false },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    userId: { type: Types.ObjectId, ref: "User", required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      default: { type: Boolean, default: false },
    },
    subtotal: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.ORDER_REQUESTED,
    },
    reason: { type: String, default: null },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export { Order };
