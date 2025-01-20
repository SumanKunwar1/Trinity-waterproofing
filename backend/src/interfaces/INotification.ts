import { Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  message: string;
  type: "success" | "info" | "warning" | "error";
}
