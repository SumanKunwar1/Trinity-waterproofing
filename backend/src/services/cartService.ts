// cart.service.ts
import { Cart, Product, IProduct } from "../models";
import { ICartItem } from "../interfaces";
import { httpMessages } from "../middlewares";
import { cp } from "fs";
export class CartService {
  public async addToCart(userId: string, cartItem: ICartItem) {
    try {
      const { productId, color, quantity } = cartItem;

      const product = await Product.findById(productId);
      if (!product) {
        throw httpMessages.NOT_FOUND("Product not found");
      }
      // Validate if the product has color variants
      if (product.colors && product.colors.length > 0) {
        // Product has color variants, ensure a color is selected
        if (!color) {
          throw httpMessages.BAD_REQUEST(
            "Please select a color before adding to the cart."
          );
        }

        // Ensure the selected color exists in the product's variants
        const colorExists = product.colors.some(
          (c) => c.hex === color || c.name === color
        );
        if (!colorExists) {
          throw httpMessages.BAD_REQUEST(
            `Invalid color selected for product '${
              product.name
            }'. Available colors: ${product.colors
              .map((c) => c.name)
              .join(", ")}`
          );
        }
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({
          userId,
          items: [cartItem],
        });
        await cart.save();
      } else {
        // If cart exists, check if the product with the same variant already exists
        const existingItemIndex = cart.items.findIndex(
          (item) => item.productId.equals(productId) && item.color === color
        );

        if (existingItemIndex !== -1) {
          // Product with the same color exists; update the quantity
          console.log("the ditto product in the cart exists! ");
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Different variant or new product; add as a new item
          console.log("the product is not ditto!");
          cart.items.push(cartItem);
        }

        // Save the updated cart
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
        return []; // No cart found
      }

      // Get an array of productIds from the cart items
      const productIds = cart.items.map((item) => item.productId);

      // Fetch the products by the productIds
      const products = await Product.find({ _id: { $in: productIds } }).exec();

      // Log to ensure products are fetched correctly
      console.log("Fetched Products:", products);

      // Create a map of product _id to product document
      const productMap: { [key: string]: IProduct } = products.reduce(
        (acc, product) => {
          acc[product._id.toString()] = product; // Map productId (converted to string) to product document
          return acc;
        },
        {} as { [key: string]: IProduct }
      );

      // Log to verify product mapping
      console.log("Product Map:", productMap);

      // Create a modified items array manually
      const modifiedItems = cart.items.map((item) => {
        // Convert productId to string to match the key in productMap
        const product = productMap[item.productId.toString()];

        if (!product) {
          console.warn(`Product not found for productId: ${item.productId}`);
          return null; // Handle missing product gracefully
        }

        // Construct the modified item object
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

      // Filter out null items (if any product was missing)
      const validItems = modifiedItems.filter((item) => item !== null);

      // Construct the final cart object
      const cartItems = {
        userId: cart.userId,
        items: validItems,
      };

      return cartItems;
    } catch (error) {
      console.error("Error in getCartByUserId:", error);
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
