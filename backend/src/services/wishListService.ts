import { WishList, User, Product } from "../models";

export class WishListService {
  public async addToWishlist(userId: string, productId: string) {
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
  }

  public async removeFromWishlist(userId: string, productId: string) {
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
  }
}
