// cartItem.interface.ts
import { Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  color?: string;
  quantity: number;
  price: number;
}
