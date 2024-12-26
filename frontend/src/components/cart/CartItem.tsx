import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../common/Button";
import { ICartItem } from "../../types/ICartItem";

interface CartItemProps {
  item: ICartItem;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrease = () => {
    if (quantity < item.inStock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.productId, newQuantity);
      toast.success(`Quantity increased to ${newQuantity}`);
    } else {
      toast.error("Cannot exceed available stock.");
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.productId, newQuantity);
      toast.success(`Quantity decreased to ${newQuantity}`);
    } else {
      toast.error("Quantity cannot be less than 1.");
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(
      1,
      Math.min(parseInt(e.target.value), item.inStock)
    );
    setQuantity(newQuantity);
    onUpdateQuantity(item.productId, newQuantity);
    toast.success(`Quantity updated to ${newQuantity}`);
  };

  const handleRemove = () => {
    onRemove(item.productId);
  };

  return (
    <div className="flex items-center justify-between mb-6 p-4 border-b border-gray-300">
      <Link to={`/product/${item.productId}`}>
        <div className="flex items-center gap-4">
          <img
            src={item.productImage}
            alt={item.name}
            className="w-20 h-20 object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            {item.color && (
              <p className="text-sm text-gray-600 flex flex-row gap-2 items-center">
                Color:{" "}
                <span
                  style={{ backgroundColor: item.color }}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                ></span>
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            className="bg-gray-200 hover:bg-gray-300 rounded-lg py-2 px-4"
            onClick={handleDecrease}
          >
            -
          </Button>

          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 text-center rounded-lg py-2 border border-gray-300"
            min="1"
            max={item.inStock}
          />

          <Button
            variant="primary"
            className="bg-gray-200 hover:bg-gray-300 rounded-lg py-2 px-4"
            onClick={handleIncrease}
          >
            +
          </Button>
        </div>
        <Button variant="outline" onClick={handleRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
