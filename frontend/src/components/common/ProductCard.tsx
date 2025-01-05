import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";
import { useWishlist } from "../../context/WishlistContext";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { IProduct } from "../../types/product";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isLoggedIn = !!localStorage.getItem("authToken");

  const averageRating =
    product.review && product.review.length
      ? product.review.reduce((acc, review) => acc + review.rating, 0) /
        product.review.length
      : 0;

  const userRole = localStorage.getItem("userRole");
  const displayedPrice =
    userRole === "b2b" ? product.wholeSalePrice : product.retailPrice;

  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        toast.info(`${product.name} removed from your wishlist.`);
      } else {
        await addToWishlist(product._id);
        toast.success(`${product.name} added to your wishlist.`);
      }
    } catch (error) {
      toast.error("Failed to update wishlist. Please try again.");
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-lg shadow-md overflow-hidden relative"
    >
      <Link to={`/product/${product._id}`}>
        <img
          src={`${product.productImage}`}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        </Link>
        <p className="text-gray-600 mb-4">
          {product.description.slice(0, 100)}...
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Rs {displayedPrice}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`text-xl ${
                  index < Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-1 text-sm text-gray-600">
              ({product.review ? product.review.length : 0})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center w-full mt-4">
          {isLoggedIn ? (
            <Button
              onClick={() => navigate(`/product/${product._id}`)}
              size="sm"
              className="flex align-middle text-center w-full justify-center"
            >
              View Product
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              size="sm"
              className="flex align-middle text-center justify-between"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
      >
        <FaHeart
          className={`${
            isInWishlist(product._id) ? "text-red-500" : "text-gray-400"
          }`}
          size={20}
        />
      </button>
    </motion.div>
  );
};

export default ProductCard;
