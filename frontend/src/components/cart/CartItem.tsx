import React, { useState } from "react";
import { CartItem as CartItemType } from "../../types/cart";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../common/Button";

interface CartItemProps {
  item: CartItemType & { selectedVariants: any };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
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
      onUpdateQuantity(newQuantity);
      toast.success(`Quantity increased to ${newQuantity}`);
    } else {
      toast.error("Cannot exceed available stock.");
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(newQuantity);
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
    onUpdateQuantity(newQuantity);
    toast.success(`Quantity updated to ${newQuantity}`);
  };

  const handleRemove = () => {
    onRemove();
    toast.info(`${item.name} removed from the cart.`);
  };

  return (
    <div className="flex items-center justify-between mb-6 p-4 border-b border-gray-300">
      {/* Left side: Image and Details */}
      <Link to={`/product/${item.id}`}>
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <img
            src={item.productImage}
            alt={item.name}
            className="w-20 h-20 object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      </Link>

      {/* Right side: Quantity and Remove */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            className="bg-gray-200 hover:bg-gray-300 rounded-lg py-2 px-4"
            onClick={handleDecrease}
          >
            -
          </Button>

          <span
            onChange={handleQuantityChange}
            className="w-10 text-center  rounded-lg py-2"
          >
            {quantity}
          </span>
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
