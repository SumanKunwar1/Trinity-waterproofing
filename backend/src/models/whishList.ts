import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWishlist extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  product_id: Types.ObjectId[];
  added_at: Date;
}

const wishlistSchema: Schema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User", required: true },
    product_id: [{ type: Types.ObjectId, ref: "Product", required: true }],
  },
  { timestamps: true }
);

const WishList = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export { WishList };
