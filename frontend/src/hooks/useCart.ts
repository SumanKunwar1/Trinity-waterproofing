import useSWR from "swr";
import { toast } from "react-toastify";
import type { ICartItem } from "../types/cart";

const API_BASE = "/api";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export function useCart() {
  const userId = JSON.parse(localStorage.getItem("userId") || '""');
  const { data, error, isLoading, mutate } = useSWR<{ items: ICartItem[] }>(
    userId ? `${API_BASE}/cart/${userId}` : null,
    fetcher
  );

  const addToCart = async (
    productId: string,
    quantity: number,
    price: number,
    color?: string
  ) => {
    try {
      const response = await fetch(`${API_BASE}/cart/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity, price, color }),
      });

      if (!response.ok) throw new Error("Failed to add item to cart");

      const newData = await response.json();
      mutate(newData, false);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      mutate(
        (data) => ({
          ...data,
          items: data?.items.map((item) =>
            item._id === cartItemId ? { ...item, quantity } : item
          ),
        }),
        false
      );

      const response = await fetch(`${API_BASE}/cart/${userId}/${cartItemId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      const newData = await response.json();
      mutate(newData);
      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating item quantity:", error);
      mutate();
      toast.error("Failed to update quantity. Please try again.");
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      mutate(
        (data) => ({
          ...data,
          items: data?.items.filter((item) => item._id !== cartItemId),
        }),
        false
      );

      const response = await fetch(`${API_BASE}/cart/${userId}/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to remove item");

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      mutate();
      toast.error("Failed to remove item. Please try again.");
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      mutate({ items: [] }, false);

      const response = await fetch(`${API_BASE}/cart/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to clear cart");

      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      mutate();
      toast.error("Failed to clear cart. Please try again.");
      throw error;
    }
  };

  return {
    cart: data?.items || [],
    isLoading,
    isError: !!error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
