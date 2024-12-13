import React from "react";
import { CartItem } from "../../types/cart";

interface OrderSummaryProps {
  cartItems: CartItem[];
  variantDetails: any[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  variantDetails,
}) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-100 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        {cartItems.map((item, index) => (
          <div key={item.id} className="border-b border-gray-300 pb-4">
            <div className="flex justify-between">
              <span className="font-semibold text-brand">{item.name}</span>
              <span>Rs {item.price.toFixed(2)}</span>
            </div>
            {variantDetails[index] &&
              Object.keys(variantDetails[index]).map((key) => (
                <p key={key} className="text-sm text-gray-600 mt-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                  <span className="font-semibold">
                    {variantDetails[index][key]}
                  </span>
                </p>
              ))}
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{item.quantity}</span>
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>Rs {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>Rs {tax.toFixed(2)}</span>
        </div>
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
