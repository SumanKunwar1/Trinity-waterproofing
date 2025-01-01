import mongoose, { Schema, Document, Types } from "mongoose";

// Define the Color interface for the colors array
export interface IColor {
  name: string;
  hex: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  retailPrice: number;
  wholeSalePrice: number;
  review: [Types.ObjectId];
  description?: string;
  productImage: string;
  image: string[];
  features: string;
  brand: Types.ObjectId;
  colors?: IColor[]; // Updated to an array of IColor objects
  inStock: number;
  subCategory: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
      },
    ],
    inStock: { type: Number, required: true },
    subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export { Product };
