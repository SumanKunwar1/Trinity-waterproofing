import mongoose, { Schema, Document, Types } from "mongoose";
import { IOrderItem } from "../interfaces";
import { OrderStatus } from "../config/orderStatusEnum";

export interface IOrder extends Document {
  products: IOrderItem[];
  userId: Types.ObjectId;
  AddressId: Types.ObjectId;
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  created_at?: Date;
  updated_at?: Date;
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
    addressId: {
      type: Types.ObjectId,
      ref: "User.addressBook",
      required: true,
    },
    subtotal: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.ORDER_REQUESTED,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export { Order };
