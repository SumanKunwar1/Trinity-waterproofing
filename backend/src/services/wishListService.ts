import { WishList, User, Product } from "../models";

export class WishListService {
  public async addToWishlist(userId: string, productId: string) {
    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!user || !product) {
        throw new Error("User or Product not found");
      }

      let wishlist = await WishList.findOne({ user_id: user._id });

      if (!wishlist) {
        wishlist = new WishList({
          user_id: user._id,
          product_id: [product._id],
        });
      } else {
        if (!wishlist.product_id.includes(product._id)) {
          wishlist.product_id.push(product._id);
        }
      }

      await wishlist.save();
      console.log("Product added to wishlist:", wishlist);
      return wishlist;
    } catch (error) {
      throw error;
    }
  }

  public async removeFromWishlist(userId: string, productId: string) {
    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!user || !product) {
        throw new Error("User or Product not found");
      }

      const wishlist = await WishList.findOne({ user_id: user._id });

      if (!wishlist) {
        throw new Error("Wishlist not found");
      }

      wishlist.product_id = wishlist.product_id.filter(
        (id) => id.toString() !== product._id.toString()
      );

      await wishlist.save();
      console.log("Product removed from wishlist:", wishlist);
      return wishlist;
    } catch (error) {
      throw error;
    }
  }

  public async getWishlist(userId: string) {
    try {
      const wishlist = await WishList.findOne({ user_id: userId });

      if (!wishlist) {
        return [];
      }

      const productIds = wishlist.product_id;
      const products = await Product.find({ _id: { $in: productIds } }).select(
        "_id name productImage description wholeSalePrice retailPrice"
      );

      const populatedWishlist = products.map((product) => ({
        ...product.toObject(),
        productImage: `/api/image/${product.productImage}`,
      }));

      console.log("Wishlist retrieved:", populatedWishlist);
      return populatedWishlist;
    } catch (error) {
      throw error;
    }
  }
}
