import mongoose, { Schema, Document, Types } from "mongoose";

interface IPrivacyPolicy extends Document {
  _id: Types.ObjectId;
  content: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const privacyPolicySchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    version: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

privacyPolicySchema.pre<IPrivacyPolicy>("save", function (next) {
  this.version += 1;
  next();
});

const PrivacyPolicy = mongoose.model<IPrivacyPolicy>(
  "PrivacyPolicy",
  privacyPolicySchema
);

export { PrivacyPolicy };
