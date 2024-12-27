import React from "react";
import { useLocation } from "react-router-dom";
import { ICartItem } from "../../types/cart";

interface OrderSummaryProps {
  cartItems?: ICartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const location = useLocation();
  const checkoutData = location.state?.checkoutData;

  const itemsToDisplay = checkoutData || cartItems || [];

  const total = itemsToDisplay.reduce((total, item) => {
    const price = item.price || item.product?.price || 0;
    const quantity = item.quantity || 1;
    return total + price * quantity;
  }, 0);

  return (
    <div className="bg-gray-100 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        {itemsToDisplay.map((item, index) => {
          const product = item.product || item;
          const price = item.price || product.price || 0;
          const quantity = item.quantity || 1;
          const color = item.selectedColor || item.color || null;

          return (
            <div
              key={product._id || index}
              className="border-b border-gray-300 pb-4"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-brand">{product.name}</span>
                <span>Rs {(price * quantity).toFixed(2)}</span>
              </div>
              {color && (
                <p className="text-sm text-gray-600 mt-1 flex flex-row gap-2 items-center">
                  Color:{" "}
                  <span className="font-semibold">
                    <span
                      style={{ backgroundColor: color }}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                    ></span>
                  </span>
                </p>
              )}
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
            </div>
          );
        })}
        <div className="border-gray-300 pt-2 mt-2">
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
