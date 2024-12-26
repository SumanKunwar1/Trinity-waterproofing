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
  productImage: string;
  image: string[];
  subCategory: string;
  features: string;
  brand: string;
  colors?: IColor[];
  inStock: number;
  review: { rating: number; comment: string }[];
}
