import { createContext, useContext } from "react";
import { useCart as useSWRCart } from "../hooks/useCart";
import type { ICartItem } from "../types/cart";

interface CartContextType {
  cart: ICartItem[];
  isLoading: boolean;
  isError: boolean;
  addToCart: (
    productId: string,
    quantity: number,
    price: number,
    color?: string
  ) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    cart,
    isLoading,
    isError,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useSWRCart();

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isError,
        addToCart,
        updateQuantity,
        removeFromCart,
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
