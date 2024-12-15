import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    number: string;
    role:string;
    createdAt?:string;
    updatedAt?: string;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        number:{type: String, required: true},
        password: { type: String, required: true },
        role:{type:String, required:true},
    },
    { timestamps: true } 
);

export const User = mongoose.model<IUser>('User', UserSchema);
