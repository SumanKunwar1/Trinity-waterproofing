import mongoose, { Schema, Document, Types } from "mongoose";

interface ITeam extends Document {
  _id: Types.ObjectId;
  name: string;
  role?: string;
  image: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

const teamSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String },
    image: { type: String, required: true },
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>("Team", teamSchema);
