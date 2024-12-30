import mongoose, { Schema, Document, Types } from "mongoose";

interface ISlider extends Document {
  _id: Types.ObjectId;
  title?: string;
  subtitle?: string;
  media: { type: string; url: string };
  isvisible?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sliderSchema = new Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    media: {
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
      },
      url: { type: String, required: true },
    },
    isvisible: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const Slider = mongoose.model<ISlider>("Slider", sliderSchema);
