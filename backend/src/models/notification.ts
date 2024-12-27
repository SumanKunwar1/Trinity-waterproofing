import mongoose, { Document, Schema, Types } from "mongoose";

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["success", "info", "warning", "error"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
