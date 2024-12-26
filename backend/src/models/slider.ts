import mongoose, { Schema, Document, Types } from "mongoose";

interface ISlider extends Document {
  _id: Types.ObjectId;
  title?: string;
  subtitle?: string;
  image: string;
  isvisible?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sliderSchema = new Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    image: { type: String, required: true },
    isvisible: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const Slider = mongoose.model<ISlider>("Slider", sliderSchema);
