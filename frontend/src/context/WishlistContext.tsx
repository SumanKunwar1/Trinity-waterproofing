import { createContext, useContext } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { WishlistItem } from "../types/wishlist";

interface WishlistContextType {
  wishlist: WishlistItem[];
  isLoading: boolean;
  isError: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch wishlist");
  const data = await response.json();
  return transformApiData(data);
};

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
  const userId = localStorage.getItem("userId");
  const isLoggedIn = !!localStorage.getItem("authToken");

  const {
    data: wishlist = [],
    error,
    mutate,
  } = useSWR<WishlistItem[]>(
    isLoggedIn && userId ? `/api/wishlist/${JSON.parse(userId)}/` : null,
    fetcher
  );

  const addToWishlist = async (productId: string) => {
    try {
      if (!userId) throw new Error("User ID not found");

      // Optimistic update
      const optimisticData = [...wishlist, { productId }];
      await mutate(optimisticData, false);

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
      await mutate(transformApiData(data));
    } catch (error: any) {
      await mutate(); // Revert optimistic update
      const errorMessage =
        error?.response?.data?.error ||
        "Failed to add product to wishlist. Please try again.";
      console.error("Error adding to wishlist:", error);
      toast.error(errorMessage);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (!userId) throw new Error("User ID not found");

      // Optimistic update
      const optimisticData = wishlist.filter(
        (item) => item.productId !== productId
      );
      await mutate(optimisticData, false);

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
      await mutate(transformApiData(data));
    } catch (error: any) {
      await mutate(); // Revert optimistic update
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
      value={{
        wishlist,
        isLoading: !error && !wishlist,
        isError: !!error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
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
