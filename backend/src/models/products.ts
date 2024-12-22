import mongoose, { Schema, Document, Types } from "mongoose";

// Define the IVariant interface
interface IVariant {
  color?: string; // Optional since it's not required in the schema
  volume?: string; // Optional since it's not required in the schema
  label: string;
  value: string;
  retailPrice: number;
  wholeSalePrice: number;
  isColorChecked?: boolean; // Optional since it defaults to false
  isVolumeChecked?: boolean; // Optional since it defaults to false
}

// Define the IProduct interface
interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  retailPrice: number;
  wholeSalePrice: number;
  review: [Types.ObjectId]; // Singular and optional to match the schema
  description?: string;
  productImage: string;
  image: string[];
  features: string[];
  brand: string;
  variants: IVariant[]; // Array of IVariant
  inStock: number; // Correcting from instock to inStock to match schema
  subCategory: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

// Define the variant schema
const variantSchema: Schema = new Schema({
  color: { type: String, required: false },
  volume: { type: String, required: false },
  label: { type: String, required: true },
  value: { type: String, required: true },
  retailPrice: { type: Number, required: true },
  wholeSalePrice: { type: Number, required: true },
  isColorChecked: { type: Boolean, default: false },
  isVolumeChecked: { type: Boolean, default: false },
});

// Define the main product schema
const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  review: [{ type: Types.ObjectId, ref: "Review", default: [] }],
  description: { type: String, default: "" },
  productImage: { type: String, required: true },
  image: [String],
  features: [String],
  brand: { type: String, required: true },
  variants: [variantSchema], // Using the variantSchema defined above
  inStock: { type: Number, required: true },
  subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Define and export the Product model
const Product = mongoose.model<IProduct>("Product", productSchema);

export { Product };
