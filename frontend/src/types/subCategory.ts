import { IProduct } from "./product";
export interface SubCategory {
  _id: string;
  name: string;
  products: IProduct[]; // Each subCategory directly contains products
}
