import React from "react";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  // Calculate the total price of the cart
  const total = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="bg-gray-100 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        {/* Iterate over each cart item */}
        {cartItems.map((item) => (
          <div key={item.productId} className="border-b border-gray-300 pb-4">
            {/* Display item name and total price for this item */}
            <div className="flex justify-between">
              <span className="font-semibold text-brand">{item.name}</span>
              <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
            </div>
            {/* Optionally display color if available */}
            {item.color && (
              <p className="text-sm text-gray-600 mt-1">
                Color: <span className="font-semibold">{item.color}</span>
              </p>
            )}
            {/* Display the quantity */}
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{item.quantity}</span>
            </div>
          </div>
        ))}
        {/* Display the total price for all items */}
        <div className="border-t border-gray-300 pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>Rs {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
