import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  color: string;
  quantity: number;
}
