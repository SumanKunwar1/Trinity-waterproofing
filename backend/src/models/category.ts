import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export { Category };
