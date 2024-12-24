import React from "react";

interface IColor {
  name: string;
  hex: string;
}

interface IVariant {
  color?: string;
  volume?: string;
  label: string;
  value: string;
  wholeSalePrice: number;
  retailPrice: number;
  isColorChecked: boolean;
  isVolumeChecked: boolean;
}

interface IProduct {
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  productImage: string;
  image: string[];
  subCategory: string;
  features: string;
  brand: string;
  colors?: IColor[];
  inStock: number;
}

interface CartItem extends IProduct {
  quantity: number;
  selectedVariant?: IVariant;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.selectedVariant
      ? item.selectedVariant.retailPrice
      : item.retailPrice;
    return total + price * item.quantity;
  }, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="bg-gray-100 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        {cartItems.map((item) => (
          <div key={item.name} className="border-b border-gray-300 pb-4">
            <div className="flex justify-between">
              <span className="font-semibold text-brand">{item.name}</span>
              <span>
                Rs{" "}
                {(
                  (item.selectedVariant
                    ? item.selectedVariant.retailPrice
                    : item.retailPrice) * item.quantity
                ).toFixed(2)}
              </span>
            </div>
            {item.selectedVariant && (
              <>
                {item.selectedVariant.color && (
                  <p className="text-sm text-gray-600 mt-1">
                    Color:{" "}
                    <span className="font-semibold">
                      {item.selectedVariant.color}
                    </span>
                  </p>
                )}
                {item.selectedVariant.volume && (
                  <p className="text-sm text-gray-600 mt-1">
                    Volume:{" "}
                    <span className="font-semibold">
                      {item.selectedVariant.volume}
                    </span>
                  </p>
                )}
              </>
            )}
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
