import mongoose, { Schema, Types } from "mongoose";

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
  variants: [
    {
      color: { type: String, required: true },
      volume: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  inStock: { type: Number, required: true },
  subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

interface IVariant {
  color: string;
  volume: string;
  price: number;
}

interface IProduct {
  // Unique identifier for the product
  name: string; // Name of the product
  description: string; // Detailed description of the product
  retailPrice: number; // Base price of the product
  wholeSalePrice: number; // Wholesale price of the product
  productImage: string; // URL of the main product image
  image: string[]; // Array of additional image URLs
  subCategory: Types.ObjectId; // ID of the subcategory the product belongs to
  features: string; // Array of features or highlights of the product
  brand: string; // Brand name of the product
  variants: {
    color?: string; // Optional field for color of the variant
    volume?: string; // Optional field for volume (if applicable)
    label?: string; // Description of the variant, e.g., "Color: Red", "Size: 500ml"
    value?: string; // Specific value of the variant, e.g., "#FF0000" for color, "500ml" for size
    price: number; // Price of the specific variant
  }[]; // Array of product variants, including color, volume, and price
  inStock: number;
}

export { Product, IProduct, IVariant };
