import React, { createContext, useState, useContext, useEffect } from "react";
import { Product } from "../types/product";
import { toast } from "react-toastify"; // Import toast function
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Load cart from localStorage when the app starts
  const loadCartFromLocalStorage = (): CartItem[] => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : []; // Return an empty array if no cart is found
  };

  const [cartItems, setCartItems] = useState<CartItem[]>(
    loadCartFromLocalStorage
  );

  // Save cart data to localStorage whenever cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart"); // Remove cart from localStorage when it's empty
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Add new product to the cart
      toast.success(`${product.name} added to cart!`); // Show success toast when item is added
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);

      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
