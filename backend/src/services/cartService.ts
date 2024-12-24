// cart.service.ts
import { Cart, Product } from "../models";
import { ICartItem } from "../interfaces";
import { httpMessages } from "../middlewares";
import { Types } from "mongoose";

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
      const cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "name productImage",
      });

      if (!cart) {
        return null;
      }

      const modifiedItems = cart.items.map((item) => {
        const product = item.productId as any;
        return {
          ...item,
          productId: {
            ...product,
            productImage: product.productImage
              ? `/api/image/${product.productImage}`
              : null,
          },
        };
      });

      const cartItems = {
        ...cart.toObject(),
        items: modifiedItems,
      };

      return cartItems;
    } catch (error) {
      throw error;
    }
  }

  public async clearCart(userId: string) {
    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        throw httpMessages.NOT_FOUND("Cart not found");
      }

      await cart.deleteOne({ _id: userId });

      return "Cart cleared successfully!";
    } catch (error) {
      throw error;
    }
  }
}

export const cartService = new CartService();
