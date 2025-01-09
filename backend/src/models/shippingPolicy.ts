import mongoose, { Schema, Document, Types } from "mongoose";

interface IShippingPolicy extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const shippingPolicySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const ShippingPolicy = mongoose.model<IShippingPolicy>(
  "ShippingPolicy",
  shippingPolicySchema
);

export { ShippingPolicy };
