import mongoose, { Schema, Document, Types } from "mongoose";

interface IReview extends Document {
  _id: Types.ObjectId;
  fullName: string;
  number: string;
  image?: string[];
  content: string;
  rating: number;
  user?: string;
  date?: Date;
}

const reviewSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    fullName: { type: String, required: true },
    number: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: false,
      },
    ],
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: { type: Types.ObjectId, ref: "User", required: false },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", reviewSchema);
