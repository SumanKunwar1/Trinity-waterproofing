import mongoose, { Schema, Types } from "mongoose";

const categorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", categorySchema);

interface ICategory {
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export { Category, ICategory };
