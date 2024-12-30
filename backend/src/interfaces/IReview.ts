import { Types } from "mongoose";

export interface IReview {
  content: string;
  rating: number;
  image?: string[];
  productId: Types.ObjectId;
}
