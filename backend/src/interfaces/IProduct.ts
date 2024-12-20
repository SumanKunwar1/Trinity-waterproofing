import { Types } from "mongoose";

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

export { IProduct };
