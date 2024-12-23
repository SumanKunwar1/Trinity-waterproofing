import { WishList, User, Product } from "../models";

export class WishListService {
  public async addToWishlist(userId: string, productId: string) {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      throw new Error("User or Product not found");
    }

    const wishlistItem = new WishList({
      user_id: user._id,
      product_id: product._id,
    });

    await wishlistItem.save();
    console.log("Product added to wishlist:", wishlistItem);
  }

  public async removeFromWishlist(wishlistId: string) {
    const wishlistItem = await WishList.findByIdAndDelete(wishlistId);

    if (!wishlistItem) {
      throw new Error("Wishlist item not found");
    }

    console.log("Product removed from wishlist:", wishlistItem);
    return wishlistItem;
  }
}
