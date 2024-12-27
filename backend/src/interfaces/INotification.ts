import { Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId;
  message: string;
  type: "success" | "info" | "warning" | "error";
}
