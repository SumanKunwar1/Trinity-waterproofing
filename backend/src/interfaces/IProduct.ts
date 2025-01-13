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
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  retailDiscountedPrice?: number;
  wholeSaleDiscountedPrice?: number;
  productImage: string;
  image: string[];
  pdfUrl?: string;
  subCategory: Types.ObjectId;
  features: string;
  brand: Types.ObjectId;
  colors?: IColor[];
  inStock: number;
}

export interface IEditableProduct {
  name?: string;
  description?: string;
  wholeSalePrice?: number;
  retailPrice?: number;
  retailDiscountedPrice?: number;
  wholeSaleDiscountedPrice?: number;
  pdfUrl?: string;
  colors?: { name: string; hex: string }[];
  features?: string;
  brand?: Types.ObjectId;
  inStock?: number;
  subCategory?: Types.ObjectId;
}

export { IProduct };
