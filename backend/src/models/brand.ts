import mongoose, { Schema, Document, Types } from "mongoose";

interface IBrand extends Document {
  _id: Types.ObjectId;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Brand = mongoose.model<IBrand>("Brand", brandSchema);

export { Brand };
