import { Category } from "./category";

export interface SubCategory {
  _id: string;
  name: string;
  category: Category;
}
