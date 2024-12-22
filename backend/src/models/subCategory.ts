import mongoose, { Schema, Document, Types } from "mongoose";
import { IProduct } from "../interfaces";

export interface ISubCategory extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  category: Types.ObjectId;
  product: Types.ObjectId[];
  created_at?: Date;
  updated_at?: Date;
}

const subcategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const SubCategory = mongoose.model<ISubCategory>(
  "SubCategory",
  subcategorySchema
);

export { SubCategory };
