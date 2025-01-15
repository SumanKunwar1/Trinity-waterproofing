import { Brand } from "./brand";
import { SubCategory } from "./subCategory";

export interface IColor {
  name: string;
  hex: string;
}

export interface IReview {
  rating: number;
  content: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  retailDiscountedPrice?: number;
  wholeSaleDiscountedPrice?: number;
  productImage: string;
  image: string[];
  subCategory: SubCategory;
  pdfUrl: string;
  features: string;
  brand: Brand;
  createdAt: string;
  colors?: IColor[];
  inStock: number;
  review: IReview[];
}
