import { Category } from "./category";
import { IProduct } from "./product";
export interface SubCategory {
  _id: string;
  name: string;
  category: Category;
  products: IProduct[];
}
