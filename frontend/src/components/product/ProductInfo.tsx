import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Ratings from "../common/Ratings";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
interface IColor {
  name: string;
  hex: string;
}

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
  colors?: IColor[];
  inStock: number;
  review: { rating: number; comment: string }[];
}
interface ProductInfoProps {
  product: IProduct;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.retailPrice);
  const { addToCart } = useCart();

  const colors = product.colors || [];

  useEffect(() => {
    // If no color is selected, set the first color as default
    if (!selectedColor && colors.length > 0) {
      setSelectedColor(colors[0].hex);
    }
  }, [colors, selectedColor]);

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.info(`${product.name} removed from your wishlist.`);
    } else {
      addToWishlist(product);
    }
  };

  const handleColorChange = (colorHex: string) => {
    setSelectedColor(colorHex);
  };

  const handleQuantityIncrease = () => {
    if (quantity < product.inStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Quantity exceeds stock");
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity <= product.inStock) {
      const productWithColor = {
        ...product,
        selectedColor,
        price,
      };

      addToCart(productWithColor, quantity);
    } else {
      toast.error("Not enough stock available");
    }
  };

  const handleBuyNow = () => {
    if (quantity <= product.inStock) {
      const checkoutData = {
        product,
        selectedColor,
        quantity,
        price,
      };

      navigate("/checkout", { state: checkoutData });
    } else {
      toast.error("Not enough stock available");
    }
  };

  const averageRating = product.review.length
    ? product.review.reduce((acc, review) => acc + review.rating, 0) /
      product.review.length
    : 0;

  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole");

  // Determine price based on user role (B2B or B2C)
  const displayedPrice =
    userRole === "b2b" ? product.wholeSalePrice : product.retailPrice;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Ratings
            rating={averageRating}
            ratingCount={`${product.review.length} Ratings`}
          />
        </div>

        <button onClick={toggleWishlist} className="text-red-500 text-lg">
          <FaHeart
            className={`cursor-pointer ${
              isInWishlist(product._id) ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Display the price based on user role */}
      <p className="text-2xl font-semibold text-blue-600 mb-2">
        Rs {displayedPrice.toFixed(2)}
      </p>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-gray-500 mb-2">In Stock: {product.inStock}</p>

      {/* Color Selection */}
      {colors.length > 0 && (
        <div className="mb-3">
          <h2 className="text-lg font-medium mb-2">Select Color</h2>
          <div className="flex flex-wrap gap-4">
            {colors.map((color) => (
              <label
                key={color.hex}
                className={`flex items-center gap-3 cursor-pointer ${
                  selectedColor === color.hex
                    ? "ring-1 ring-blue-500 scale-110"
                    : ""
                } p-2 rounded-md transition-all duration-200`}
              >
                <input
                  type="radio"
                  name="color"
                  value={color.hex}
                  checked={selectedColor === color.hex}
                  onChange={() => handleColorChange(color.hex)}
                  className="hidden"
                />
                <span
                  className={`w-8 h-8 rounded-full ${
                    selectedColor === color.hex
                      ? "ring-0 border border-blue-500"
                      : "ring-0"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                ></span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            onClick={handleQuantityDecrease}
            className="px-3 text-xl py-2 bg-gray-200 rounded-full focus:outline-none focus:inset-0"
          >
            -
          </Button>
          <span className="text-xl">{quantity}</span>
          <Button
            variant="primary"
            onClick={handleQuantityIncrease}
            className="px-3 text-xl py-2 bg-gray-200 rounded-full focus:outline-none focus:inset-0"
          >
            +
          </Button>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex space-x-4"
      >
        <Button onClick={handleBuyNow} className="w-full md:w-auto">
          Buy Now
        </Button>
        <Button onClick={handleAddToCart} className="w-full md:w-auto">
          Add to Cart
        </Button>
      </motion.div>
    </div>
  );
};

export default ProductInfo;
