import mongoose, { Schema, Document, Types } from "mongoose";

interface INewsLetter extends Document {
  _id: Types.ObjectId;
  email: string;
  createdAt: Date;
}

const newsLetterSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const NewsLetter = mongoose.model<INewsLetter>("NewsLetter", newsLetterSchema);

export { NewsLetter };
