import { Types } from "mongoose";
import { IColor } from "../models";

interface IVariant {
  color?: string; // Optional field for color of the variant
  volume?: string; // Optional field for volume (if applicable)
  label: string; // Label or name of the variant, e.g., "Red", "500ml"
  value: string; // Specific value of the variant, e.g., "#FF0000" for color, "500ml" for size
  wholeSalePrice: number; // Price of the variant
  retailPrice: number; // Price of the variant
  isColorChecked: boolean; // Whether the color is selected or not
  isVolumeChecked: boolean; // Whether the volume is selected or not
}

interface IProduct {
  name: string; // Product name
  description: string; // Product description
  wholeSalePrice: number;
  retailPrice: number;
  productImage: string; // Main product image URL
  image: string[]; // Additional images URLs
  subCategory: Types.ObjectId; // Subcategory ID
  features: string[]; // Features of the product
  brand: Types.ObjectId; // Brand name
  colors?: IColor[];
  inStock: number; // Product stock quantity
}

export { IProduct };
