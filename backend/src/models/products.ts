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
  retailDiscountedPrice?: number; // New optional field
  wholeSaleDiscountedPrice?: number;
  review: [Types.ObjectId];
  description?: string;
  productImage: string;
  image: string[];
  pdfUrl?: string;
  features: string;
  brand: Types.ObjectId;
  colors?: IColor[]; // Updated to an array of IColor objects
  inStock: number;
  isFeatured: boolean;
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
    retailDiscountedPrice: { type: Number, default: 0 }, // Optional field
    wholeSaleDiscountedPrice: { type: Number, default: 0 }, // Optional field
    productImage: { type: String, required: true },
    pdfUrl: { type: String, required: false },
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
    isFeatured: { type: Boolean, default: false },
    subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export { Product };
