import mongoose, { Schema, Document, Types } from "mongoose";

interface ISubCategory extends Document {
  name: string;
  description?: string;
  category: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

const subcategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model<ISubCategory>(
  "SubCategory",
  subcategorySchema
);

export { SubCategory };
