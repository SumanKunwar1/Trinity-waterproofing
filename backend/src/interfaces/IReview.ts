import { Types } from "mongoose";

export interface IReview {
  content: string;
  rating: number;
  productId: Types.ObjectId;
}
