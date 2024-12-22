import mongoose, { Schema, Document, Types } from "mongoose";
import { ISubCategory } from "../interfaces";

interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  subCategory: Types.ObjectId[];
  created_at?: Date;
  updated_at?: Date;
}

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export { Category };
