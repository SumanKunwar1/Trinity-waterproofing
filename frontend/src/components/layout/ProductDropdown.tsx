import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";
import { Category } from "../../types/category";

interface ProductDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDropdown: React.FC<ProductDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(
    null
  );

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");
      setCategories(response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch categories.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchCategories();
      setLoading(false);
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute left-0 right-0 top-full bg-hover shadow-md z-50"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Product Categories</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div
                key={category._id}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category._id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer group">
                  <h3 className="text-xl text-brand font-semibold">
                    {category.name}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      hoveredCategory === category._id ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {hoveredCategory === category._id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 top-full w-full bg-white shadow-lg rounded-md mt-1 z-10"
                    >
                      {category.subCategories.map((sub) => (
                        <div
                          key={sub._id}
                          className="relative"
                          onMouseEnter={() => setHoveredSubCategory(sub._id)}
                          onMouseLeave={() => setHoveredSubCategory(null)}
                        >
                          <div className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                            <span className="text-gray-700">{sub.name}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                hoveredSubCategory === sub._id
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>

                          {/* Adjust this part: instead of absolute, the product dropdown will expand */}
                          <AnimatePresence>
                            {hoveredSubCategory === sub._id && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="w-full bg-white shadow-lg rounded-md mt-1 z-10"
                              >
                                {sub.products.length > 0 ? (
                                  <div className="py-2">
                                    {sub.products.map((product) => (
                                      <Link
                                        key={product._id}
                                        to={`/product/${product._id}`}
                                        onClick={onClose}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        {product.name}
                                      </Link>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-4 text-sm text-gray-500">
                                    No products available
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <p>No categories available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDropdown;
