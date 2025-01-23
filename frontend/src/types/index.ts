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
  isFeatured: boolean;
  brand: Brand;
  createdAt: string;
  colors?: IColor[];
  inStock: number;
  review: Review[];
}

export interface Review {
  _id: string;
  name: string;
  fullName: string;
  content: string;
  rating: number;
  image: string[];
  date: string;
  createdAt: string;
}

export interface IColor {
  name: string;
  hex: string;
}

export interface Brand {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  description?: string;
  category: Category;
  products: IProduct[];
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  subCategories: SubCategory[];
}

export interface FilterValues {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  inStock: boolean;
  brands: string[];
}
