import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICard {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: string;
}

export interface IService extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: string;
  cards: ICard[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cards: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Service = mongoose.model<IService>("Service", serviceSchema);

export { Service };
