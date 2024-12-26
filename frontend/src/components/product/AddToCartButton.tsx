import React from "react";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";
import { LuShoppingCart } from "react-icons/lu";
import { toast } from "react-toastify";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  productImage: string;
  image: string[];
  subCategory: string;
  features: string;
  brand: string;
  colors?: { name: string; hex: string }[];
  inStock: number;
}

interface AddToCartButtonProps {
  product: IProduct;
  quantity?: number;
  color?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity,
  color,
}) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity, color);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      size="sm"
      className="flex align-middle text-center justify-between"
    >
      <LuShoppingCart className="mr-2 font-semibold" />
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
