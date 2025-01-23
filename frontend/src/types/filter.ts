export interface IColor {
  name: string;
  hex: string;
}

export interface IReview {
  rating: number;
  content: string;
}

export interface Brand {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  description?: string;
  category: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  subCategories: SubCategory[];
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
  features: string[];
  brand: Brand;
  createdAt: string;
  colors?: IColor[];
  inStock: number;
  review: IReview[];
}

export interface FilterOptions {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  inStock: boolean;
  brands: string[];
}
