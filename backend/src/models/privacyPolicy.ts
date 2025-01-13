import mongoose, { Schema, Document, Types } from "mongoose";

interface IPrivacyPolicy extends Document {
  _id: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const privacyPolicySchema: Schema = new Schema(
  {
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const PrivacyPolicy = mongoose.model<IPrivacyPolicy>(
  "PrivacyPolicy",
  privacyPolicySchema
);

export { PrivacyPolicy };
