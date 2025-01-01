import mongoose, { Schema, Document, Types } from "mongoose";

interface IFaq extends Document {
  _id: Types.ObjectId;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const Faq = mongoose.model<IFaq>("Faq", faqSchema);

export { Faq };
