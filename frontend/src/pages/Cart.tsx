import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";
import Button from "../components/common/Button";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* Cart Items */}
          <div className="w-full md:w-2/3 md:pr-8">
            {cartItems.map((item: CartItemType & { selectedVariants: any }) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onUpdateQuantity={(quantity) =>
                  updateQuantity(item.id, quantity)
                }
              />
            ))}
          </div>

          {/* Order Summary and Checkout Button */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0">
            <OrderSummary
              cartItems={cartItems}
              variantDetails={cartItems.map((item) => item.selectedVariants)}
            />
            <Button
              to="/checkout"
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
