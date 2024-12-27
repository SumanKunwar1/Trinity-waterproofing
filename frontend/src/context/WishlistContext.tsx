import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { WishlistItem } from "../types/wishlist";

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

// API response interfaces
interface ApiWishlistItem {
  product_id: string;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const transformApiData = (data: any): WishlistItem[] => {
  if (!Array.isArray(data) && data?.wishlist && Array.isArray(data.wishlist)) {
    data = data.wishlist;
  }

  if (!Array.isArray(data)) {
    console.error("Expected array response from API, received:", data);
    return [];
  }

  return data.map((item: any) => ({
    productId: item.product_id || item.productId || item._id || "",
  }));
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const isLoggedIn = !!localStorage.getItem("authToken");

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(`/api/wishlist/${JSON.parse(userId)}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch wishlist");

      const data = await response.json();
      console.log("Fetch wishlist response:", data); // Debug log
      setWishlist(transformApiData(data));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        "Failed to fetch wishlist. Please try again.";
      console.error("Error fetching wishlist:", error);
      toast.error(errorMessage);
      setWishlist([]); // Reset wishlist on failure
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(
        `/api/wishlist/${JSON.parse(userId)}/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to add to wishlist");

      const data = await response.json();
      console.log("Add to wishlist response:", data); // Debug log

      const newData = Array.isArray(data)
        ? data
        : data.item
        ? [data.item]
        : [data];
      setWishlist(transformApiData(newData));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        "Failed to add product to wishlist. Please try again.";
      console.error("Error adding to wishlist:", error);
      toast.error(errorMessage);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(
        `/api/wishlist/${JSON.parse(userId)}/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to remove from wishlist");

      const data = await response.json();
      console.log("Remove from wishlist response:", data); // Debug log
      setWishlist(transformApiData(data));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        "Failed to remove product from wishlist. Please try again.";
      console.error("Error removing from wishlist:", error);
      toast.error(errorMessage);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
