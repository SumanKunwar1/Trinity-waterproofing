import mongoose, { Schema, Document, Types } from "mongoose";

interface ICompanyDetails extends Document {
  _id: Types.ObjectId;
  Name: string;
  phoneNumber: string;
  location: string;
  email: string;
  twitter?: string;
  facebook?: string;
  google_plus?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companyDetailsSchema: Schema = new Schema(
  {
    Name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    twitter: { type: String, required: false },
    facebook: { type: String, required: false },
    google_plus: { type: String, required: false },
    youtube: { type: String, required: false },
    linkedin: { type: String, required: false },
    instagram: { type: String, required: false },
  },
  { timestamps: true }
);

const CompanyDetails = mongoose.model<ICompanyDetails>(
  "CompanyDetails",
  companyDetailsSchema
);

export { CompanyDetails };
