import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import type { ICartItem } from "../../types/cart";
import { useCart } from "../../hooks/useCart";

interface CartItemProps {
  item: ICartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    if (newQuantity > item.inStock) {
      toast.error("Cannot exceed available stock");
      return;
    }
    try {
      await updateQuantity(item._id!, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item._id!);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 p-4 border-b border-gray-300">
      <Link
        to={`/product/${item.productId}`}
        className="flex items-center gap-4 mb-4 md:mb-0"
      >
        <img
          src={item.productImage}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-md"
        />
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
          {item.color && (
            <p className="text-sm text-gray-600 flex flex-row gap-2 items-center">
              Color:{" "}
              <span
                style={{ backgroundColor: item.color }}
                className="w-5 h-5 rounded-full flex items-center justify-center border border-gray-300"
              />
            </p>
          )}
          <p className="text-sm font-medium text-gray-900 mt-1">
            Rs {item.price.toFixed(2)}
          </p>
        </div>
      </Link>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-secondary text-white"
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            -
          </Button>

          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="w-16 text-center rounded-md py-1 px-2 border border-gray-300"
            min="1"
            max={item.inStock}
          />

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-secondary text-white"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            +
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          className="mt-2"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
