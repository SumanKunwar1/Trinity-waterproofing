import { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { IProduct } from "../types/product";

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wishlist products using fetchWishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");

        // Send the API request for the wishlist
        const response = await fetch(`/api/wishlist/${JSON.parse(userId)}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch wishlist");

        const data = await response.json();
        console.log("Fetch wishlist response:", data); // Debug log

        // Assuming transformApiData is a function that transforms the data to the correct format
        setProducts(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to fetch wishlist. Please try again.");
        setProducts([]); // Empty products list in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [wishlist]); // Re-run when wishlist changes

  const handleRemove = async (productId: string, productName: string) => {
    try {
      await removeFromWishlist(productId);
      toast.info(`${productName} removed from your wishlist.`);
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Failed to remove product. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-center">
                Your wishlist is empty.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              {products.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 mb-6 last:mb-0"
                >
                  <Link
                    to={`/product/${item._id}`}
                    className="flex items-center gap-4 flex-grow"
                  >
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={`${item.productImage}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold text-brand hover:text-button transition duration-300">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(item._id, item.name)}
                    className="text-red-500 hover:text-red-700 transition duration-300 p-2"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <FaHeart size={24} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
