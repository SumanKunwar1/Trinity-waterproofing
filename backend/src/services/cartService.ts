// cart.service.ts
import { Cart, Product, IProduct } from "../models";
import { ICartItem } from "../interfaces";
import { httpMessages } from "../middlewares";
import { cp } from "fs";
export class CartService {
  public async addToCart(userId: string, cartItem: ICartItem) {
    try {
      const { productId } = cartItem;

      const product = await Product.findById(productId);
      if (!product) {
        throw httpMessages.NOT_FOUND("Product not found");
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({
          userId,
          items: [cartItem],
        });
        await cart.save();
      } else {
        cart.items.push(cartItem);

        await cart.save();
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw httpMessages.NOT_FOUND("Cart not found");
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id && item._id.equals(cartItemId)
      );

      if (itemIndex === -1) {
        throw httpMessages.NOT_FOUND("Cart item not found");
      }

      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(userId: string, cartItemId: string) {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw httpMessages.NOT_FOUND("Cart not found");
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id && item._id.equals(cartItemId)
      );

      if (itemIndex === -1) {
        throw httpMessages.NOT_FOUND("Cart item not found");
      }

      cart.items.splice(itemIndex, 1);
      await cart.save();

      return "Cart item removed successfully!";
    } catch (error) {
      throw error;
    }
  }

  public async getCartByUserId(userId: string) {
    try {
      // Retrieve the cart by userId
      const cart = await Cart.findOne({ userId }).exec();

      if (!cart) {
        return null;
      }

      // Get an array of productIds from the cart items
      const productIds = cart.items.map((item) => item.productId);

      // Fetch the products by the productIds
      const products = await Product.find({ _id: { $in: productIds } }).exec();

      // Create a map of product _id to product document
      const productMap: { [key: string]: IProduct } = products.reduce(
        (acc, product) => {
          acc[product._id.toString()] = product; // Map productId (converted to string) to product document
          return acc;
        },
        {} as { [key: string]: IProduct }
      );

      // Create a modified items array manually
      const modifiedItems = cart.items.map((item) => {
        const product = productMap[item.productId.toString()]; // Access product using the string version of the ObjectId

        // Manually create the item object with relevant data
        const modifiedItem = {
          _id: item._id,
          productId: product._id,
          name: product.name,
          description: product.description,
          inStock: product.inStock,
          productImage: product.productImage
            ? `/api/image/${product.productImage}`
            : null,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
        };
        return modifiedItem;
      });

      // Construct the final cart object manually (use created_at and updated_at)
      const cartItems = {
        userId: cart.userId,
        items: modifiedItems,
      };

      return cartItems;
    } catch (error) {
      throw error;
    }
  }

  public async clearCart(userId: string) {
    try {
      const cart = await Cart.findOne({ userId: userId });

      if (!cart) {
        throw httpMessages.NOT_FOUND("Cart not found");
      }

      await Cart.deleteOne({ _id: cart._id.toString() });
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export const cartService = new CartService();
