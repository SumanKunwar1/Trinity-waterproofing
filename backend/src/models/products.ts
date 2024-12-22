import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  retailPrice: number;
  wholeSalePrice: number;
  review: [Types.ObjectId];
  description?: string;
  productImage: string;
  image: string[];
  features: string[];
  brand: Types.ObjectId;
  colors?: string[];
  inStock: number;
  subCategory: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    review: [{ type: Types.ObjectId, ref: "Review", default: [] }],
    description: { type: String, default: "" },
    retailPrice: { type: Number, required: true },
    wholeSalePrice: { type: Number, required: true },
    productImage: { type: String, required: true },
    image: [String],
    features: [String],
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    colors: [{ type: String, required: false }],
    inStock: { type: Number, required: true },
    subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export { Product };
