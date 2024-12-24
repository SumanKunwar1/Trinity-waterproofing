import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    productId: string,
    quantity: number,
    color?: string
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch (error) {
      toast.error("Failed to fetch cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (
    productId: string,
    quantity: number,
    color?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/cart/add", {
        productId,
        quantity,
        color,
      });
      setCart(response.data);
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`/api/cart/${productId}`);
      setCart(response.data);
    } catch (error) {
      toast.error("Failed to remove item from cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`/api/cart/${productId}`, { quantity });
      setCart(response.data);
    } catch (error) {
      toast.error("Failed to update item quantity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await axios.delete("/api/cart");
      setCart([]);
    } catch (error) {
      toast.error("Failed to clear cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
