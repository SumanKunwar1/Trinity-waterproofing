import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWishlist } from "../../context/WishlistContext";
import Button from "./Button";
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
  const isB2B = userRole === "b2b";
  const regularPrice = isB2B ? product.wholeSalePrice : product.retailPrice;
  const discountedPrice = isB2B
    ? product.wholeSaleDiscountedPrice
    : product.retailDiscountedPrice;

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
      className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden relative"
    >
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square relative rounded-lg overflow-hidden">
          <img
            src={product.productImage}
            alt={product.name}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-lg font-semibold line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {product.description.slice(0, 100)}...
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.round(averageRating)
                      ? "text-yellow-300"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.review?.length || 0})
            </span>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded ${
              product.inStock
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-red-700"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            {discountedPrice ? (
              <>
                <span className="text-xl font-bold">Rs {discountedPrice}</span>
                <span className="text-sm text-gray-500 line-through">
                  Rs {regularPrice}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold">Rs {regularPrice}</span>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            View Details
          </Button>
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
