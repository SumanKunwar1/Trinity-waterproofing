import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEnquiry extends Document {
  _id: Types.ObjectId;
  fullName: string;
  number: string;
  email: string;
  message: string;
  createdAt: Date;
  updateAt: Date;
}

const enquirySchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model<IEnquiry>("Enquiry", enquirySchema);
