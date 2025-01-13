export interface IColor {
  name: string;
  hex: string;
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
  subCategory: string;
  pdfUrl: string;
  features: string;
  brand: string;
  createdAt: string;
  colors?: IColor[];
  inStock: number;
  review: { rating: number; content: string }[];
}
