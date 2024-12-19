import mongoose, { Schema, Types } from "mongoose";

const subcategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  categoryId: { type: Types.ObjectId, ref: "Category", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const SubCategory = mongoose.model("SubCategory", subcategorySchema);

interface ISubCategory {
  name: string;
  categoryId: Types.ObjectId;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export { SubCategory, ISubCategory };
