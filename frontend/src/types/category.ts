import { SubCategory } from "./subCategory";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  subCategories: SubCategory[];
}
