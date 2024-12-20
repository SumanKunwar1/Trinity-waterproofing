import { Types } from "mongoose";

interface ISubCategory {
  name: string;
  categoryId: Types.ObjectId;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export { ISubCategory };
