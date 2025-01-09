import mongoose, { Schema, Document, Types } from "mongoose";

interface IReturnPolicy extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const returnPolicySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const ReturnPolicy = mongoose.model<IReturnPolicy>(
  "ReturnPolicy",
  returnPolicySchema
);

export { ReturnPolicy };
