import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ICartItem } from "../types/cart";

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
  const isLoggedIn = !!localStorage.getItem("authToken");

  // Fetch cart when the component is mounted
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
      setCart(data.items || []); // Ensure data.items exists and is set
      setCartFetched(true); // Add this line
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Failed to fetch cart.";
      console.error("Error fetching cart:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsInitialized(true); // Set isInitialized to true after fetching
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
      setCart(data.items || []); // Update cart state after adding
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Failed to add item to cart.";
      console.error("Error adding item to cart:", error);
      toast.error(errorMessage);
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
      setCart(data.items || []); // Update cart state after removing
      window.location.reload();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Failed to remove item from cart.";
      console.error("Error removing item from cart:", error);
      toast.error(errorMessage);
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
      setCart(data.items || []); // Update cart state after quantity update
      toast.success("Item quantity updated successfully");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Failed to update item quantity.";
      console.error("Error updating item quantity:", error);
      toast.error(errorMessage);
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
      setCart([]); // Clear the cart state
      toast.success("Cart cleared successfully");
      window.location.reload();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Failed to clear cart.";
      console.error("Error clearing cart:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
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
        cartFetched, // Add this line
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
