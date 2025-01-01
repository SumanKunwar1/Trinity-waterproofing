import mongoose, { Schema, Document, Types } from "mongoose";

interface ICartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  color?: string;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema: Schema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        color: { type: String, required: false },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export { Cart };
