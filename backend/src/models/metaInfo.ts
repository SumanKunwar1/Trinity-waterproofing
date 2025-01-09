import mongoose, { Schema, Document, Types } from "mongoose";

interface IMetaInfo extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const metaInfoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [{ type: String }], // Array of strings
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    twitterCard: { type: String },
    twitterTitle: { type: String },
    twitterDescription: { type: String },
    twitterImage: { type: String },
    canonicalUrl: { type: String },
  },
  { timestamps: true }
);

const MetaInfo = mongoose.model<IMetaInfo>("MetaInfo", metaInfoSchema);

export { MetaInfo };
