import mongoose, { Schema, Document, Types } from "mongoose";

interface ICoreTab {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: string;
}

interface IAbout extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: string;
  core: ICoreTab[];
  tabs: ICoreTab[];
  createdAt: Date;
  updatedAt: Date;
}

const aboutSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    core: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    tabs: [
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

const About = mongoose.model<IAbout>("About", aboutSchema);

export { About };
