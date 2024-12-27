// src/context/CartContext.tsx

import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import { ICartItem } from "../types/cart"; // Make sure to define your ICartItem interface

interface CartContextType {
  cart: ICartItem[];
  addToCart: (
    productId: string,
    quantity: number,
    price: number,
    color?: string
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
  cartFetched: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cartFetched, setCartFetched] = useState(false);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      if (!userId) throw new Error("User ID not found");
      const response = await fetch(`/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCart(data.items || []);
      setCartFetched(true);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart. Please try again.");
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const addToCart = async (
    productId: string,
    quantity: number,
    price: number,
    color?: string
  ) => {
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      if (!userId) throw new Error("User ID not found");
      const response = await fetch(`/api/cart/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
          price,
          color,
        }),
      });
      if (!response.ok) throw new Error("Failed to add item to cart");
      const data = await response.json();
      setCart(data.items || []);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      if (!userId) throw new Error("User ID not found");
      const response = await fetch(`/api/cart/${userId}/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to remove item from cart");
      const data = await response.json();
      setCart(data.items || []);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      if (!userId) throw new Error("User ID not found");
      const response = await fetch(`/api/cart/${userId}/${productId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error("Failed to update item quantity");
      const data = await response.json();
      setCart(data.items || []);
      toast.success("Item quantity updated successfully");
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("Failed to update item quantity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      if (!userId) throw new Error("User ID not found");
      const response = await fetch(`/api/cart/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to clear cart");
      setCart([]);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        isInitialized,
        cartFetched,
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
