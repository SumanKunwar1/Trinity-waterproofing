import mongoose, { Schema, Document, Types } from "mongoose";
import { ITabAbout } from "../interfaces";

interface IAbout extends Document {
  _id: Types.ObjectId;
  tabs: ITabAbout[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const aboutSchema: Schema = new Schema<IAbout>(
  {
    tabs: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    image: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model<IAbout>("About", aboutSchema);

export { About };
