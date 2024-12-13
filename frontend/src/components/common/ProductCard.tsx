import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "../../types/product";
import Button from "./Button";
import { useWishlist } from "../../context/WishlistContext";
import { FaHeart } from "react-icons/fa";
import Ratings from "./Ratings"; // Import Ratings component
import { FiEye } from "react-icons/fi";
import { LuShoppingCart } from "react-icons/lu";
import { toast } from "react-toastify"; // Import toast for notifications

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Calculate average rating from reviews
  const averageRating = product.reviews.length
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length
    : 0;

  // Handle adding/removing from wishlist
  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from your wishlist.`);
    } else {
      addToWishlist(product);
      // toast.success(`${product.name} added to your wishlist.`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-lg shadow-md overflow-hidden relative"
    >
      <Link to={`/product/${product.id}`}>
        <img
          src={product.productImage}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        </Link>
        <p className="text-gray-600 mb-4">
          {product.description.slice(0, 100)}...
        </p>

        <div className="flex justify-between items-center">
          {/* Price */}
          <span className="text-xl font-bold">
            Rs {product.price.toFixed(2)}
          </span>

          {/* Ratings */}
          <Ratings
            rating={averageRating} // Pass average rating
            ratingCount={`${product.reviews.length}`}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            to={`/product/${product.id}`}
            size="sm"
            className="flex align-middle text-center justify-between"
          >
            <FiEye className="mr-2 font-semibold" />
            View Details
          </Button>
          <Button
            to={`/product/${product.id}`}
            size="sm"
            className="flex align-middle text-center justify-between"
          >
            <LuShoppingCart className="mr-2 font-semibold" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Wishlist Toggle Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
      >
        <FaHeart
          className={`${
            isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
          }`}
          size={20}
        />
      </button>
    </motion.div>
  );
};

export default ProductCard;
