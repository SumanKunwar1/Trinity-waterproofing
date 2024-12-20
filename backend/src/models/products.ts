import mongoose, { Schema, Types } from "mongoose";

// Variant schema with additional fields
const variantSchema: Schema = new Schema({
  color: { type: String, required: false },
  volume: { type: String, required: false },
  label: { type: String, required: true },
  value: { type: String, required: true },
  price: { type: Number, required: true },
  isColorChecked: { type: Boolean, default: false },
  isVolumeChecked: { type: Boolean, default: false },
});

// Main product schema
const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  retailPrice: { type: Number, required: true },
  wholeSalePrice: { type: Number, required: true },
  review: { type: Types.ObjectId, ref: "Review" },
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

const Product = mongoose.model("Product", productSchema);

// Updated TypeScript interfaces for product and variant
interface IVariant {
  color?: string; // Optional field for color of the variant
  volume?: string; // Optional field for volume (if applicable)
  label: string; // Label or name of the variant, e.g., "Red", "500ml"
  value: string; // Specific value of the variant, e.g., "#FF0000" for color, "500ml" for size
  price: number; // Price of the variant
  isColorChecked: boolean; // Whether the color is selected or not
  isVolumeChecked: boolean; // Whether the volume is selected or not
}

interface IProduct {
  name: string; // Product name
  description: string; // Product description
  retailPrice: number; // Retail price
  wholeSalePrice: number; // Wholesale price
  productImage: string; // Main product image URL
  image: string[]; // Additional images URLs
  subCategory: Types.ObjectId; // Subcategory ID
  features: string[]; // Features of the product
  brand: string; // Brand name
  variants: IVariant[]; // Array of variants with color, volume, label, value, price, isColorChecked, and isVolumeChecked
  inStock: number; // Product stock quantity
}

export { IProduct, Product };
