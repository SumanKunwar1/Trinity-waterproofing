import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button";
import { useWishlist } from "../../context/WishlistContext";
import { FaHeart } from "react-icons/fa";
import Ratings from "./Ratings";
import { FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import AddToCartButton from "../product/AddToCartButton";

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
  review: { rating: number }[];
}

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Calculate average rating from reviews
  const averageRating =
    product.review && product.review.length
      ? product.review.reduce((acc, review) => acc + review.rating, 0) /
        product.review.length
      : 0;

  // Determine the price based on the user role
  const userRole = localStorage.getItem("userRole");
  const displayedPrice =
    userRole === "b2b" ? product.wholeSalePrice : product.retailPrice;

  // Handle adding/removing from wishlist
  const toggleWishlist = async () => {
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
          <Ratings
            rating={averageRating}
            ratingCount={`${product.review ? product.review.length : 0}`}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            to={`/product/${product._id}`}
            size="sm"
            className="flex align-middle text-center justify-between"
          >
            <FiEye className="mr-2 font-semibold" />
            View Details
          </Button>
          <AddToCartButton product={product} />
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
