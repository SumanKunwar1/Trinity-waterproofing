import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/product";
import Button from "../common/Button";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Ratings from "../common/Ratings";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const variantTypes = Object.keys(
    product.variants.reduce((acc, variant) => {
      Object.keys(variant).forEach((key) => {
        if (key !== "label" && key !== "value" && key !== "price") {
          acc[key] = true;
        }
      });
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >(
    variantTypes.reduce((acc, type) => {
      const options = product.variants
        .map((v) => v[type as keyof typeof v])
        .filter(Boolean);
      acc[type] = options[0] || "";
      return acc;
    }, {} as Record<string, string>)
  );

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.retailPrice);
  const { addToCart } = useCart();

  useEffect(() => {
    const matchedVariant = product.variants.find((variant) =>
      variantTypes.every(
        (type) =>
          variant[type as keyof typeof variant] === selectedVariants[type]
      )
    );

    if (matchedVariant) {
      setPrice(matchedVariant.price);
    }
  }, [selectedVariants, product.variants, variantTypes]);

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from your wishlist.`);
    } else {
      addToWishlist(product);
    }
  };

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [type]: value,
    }));
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
      const variantKey = Object.keys(selectedVariants)
        .map((key) => `${key}:${selectedVariants[key]}`)
        .join("|");

      const productWithVariant = {
        ...product,
        selectedVariants,
        variantKey,
        price,
      };

      addToCart(productWithVariant, quantity);
    } else {
      toast.error("Not enough stock available");
    }
  };

  const handleBuyNow = () => {
    if (quantity <= product.inStock) {
      const checkoutData = {
        product,
        selectedVariants,
        quantity,
        price,
      };

      navigate("/checkout", { state: checkoutData });
    } else {
      toast.error("Not enough stock available");
    }
  };

  const averageRating = product.reviews.length
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length
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
            ratingCount={`${product.reviews.length} Ratings`}
          />
        </div>

        <button onClick={toggleWishlist} className="text-red-500 text-lg">
          <FaHeart
            className={`cursor-pointer ${
              isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
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

      {variantTypes.map((type) => {
        const options = [
          ...new Set(
            product.variants
              .map((v) => v[type as keyof typeof v])
              .filter(Boolean)
          ),
        ];

        return options.length > 0 ? (
          <div key={type} className="mb-3">
            <h2 className="text-lg font-medium mb-2">
              Select {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <div className="flex flex-wrap gap-4">
              {options.map((option) => {
                const isColorType = type.toLowerCase() === "color"; // Check if this variant type is 'color'
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-3 cursor-pointer ${
                      selectedVariants[type] === option
                        ? "ring-1 ring-blue-500 scale-110"
                        : ""
                    } p-2 rounded-md transition-all duration-200`}
                  >
                    <input
                      type="radio"
                      name={type}
                      value={option}
                      checked={selectedVariants[type] === option}
                      onChange={() => handleVariantChange(type, option)}
                      className="hidden " // Hide the default radio input
                    />
                    {isColorType ? (
                      // Render color boxes for 'color' type
                      <span
                        className={`w-8 h-8 rounded-full ${
                          selectedVariants[type] === option
                            ? "ring-0 border border-blue-500"
                            : "ring-0"
                        }`}
                        style={{ backgroundColor: option }}
                        title={option} // Tooltip for the color name
                      ></span>
                    ) : (
                      // Render default text for other types
                      <span className="text-base">{option}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ) : null;
      })}

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
