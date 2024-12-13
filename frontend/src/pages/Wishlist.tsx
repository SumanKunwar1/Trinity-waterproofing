import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa"; // Import heart icon

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  const handleRemove = (productId: number, productName: string) => {
    removeFromWishlist(productId);
    toast.info(`${productName} removed from your wishlist.`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-3">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 mb-6"
            >
              {/* Product Details with Link */}
              <Link
                to={`/product/${item.id}`}
                className="flex items-center gap-4"
              >
                {/* Product Image */}
                <div className="w-24 h-24">
                  <img
                    src={item.productImage || "/assets/logo.png"} // Fallback image if no image exists
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-brand hover:text-button transition duration-300">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </Link>

              {/* Heart Icon to Remove */}
              <button
                onClick={() => handleRemove(item.id, item.name)}
                className="text-red-500 hover:text-red-700 transition duration-300"
              >
                <FaHeart size={24} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
