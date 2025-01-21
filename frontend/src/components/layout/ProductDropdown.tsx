import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { IProduct } from "../../types/product";

interface ProductDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SubCategory {
  _id: string;
  name: string;
  products: IProduct[];
}

export interface Category {
  _id: string;
  name: string;
  subCategories: SubCategory[];
}

export const ProductDropdown: React.FC<ProductDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] =
    useState<SubCategory | null>(null);

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
    <>
      {/* Dynamic Meta Information */}
      <Helmet>
        {hoveredCategory && !hoveredSubCategory && (
          <>
            <title>{`Trinity Waterproofing`}</title>
            <meta
              name="description"
              content={`Explore the best solutions in ${hoveredCategory.name} by Trinity Waterproofing. Protect your property with expert waterproofing services.`}
            />
            <meta
              name="keywords"
              content={`${hoveredCategory.name}, waterproofing`}
            />
          </>
        )}
        {hoveredSubCategory && (
          <>
            <title>{`Trinity Waterproofing`}</title>
            <meta
              name="description"
              content={`Discover ${hoveredSubCategory.name} products under ${hoveredCategory?.name} at Trinity Waterproofing. Durable and professional solutions for all needs!`}
            />
            <meta
              name="keywords"
              content={`${hoveredCategory?.name}, ${hoveredSubCategory.name}, waterproofing, products`}
            />
          </>
        )}
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute left-0 right-0 top-full bg-gray-200 shadow-md z-50 min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">
              Product Categories
            </h2>
            <button onClick={onClose} className="text-2xl">
              &times;
            </button>
          </div>

          {loading && <p>Loading...</p>}

          {!loading && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="relative"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => {
                    setHoveredCategory(null);
                    setHoveredSubCategory(null);
                  }}
                >
                  <Link
                    to={`/products?category=${category._id}`}
                    className="flex items-center justify-between p-2 rounded-md cursor-pointer group"
                    onClick={onClose}
                  >
                    <h3 className="text-md sm:text-md text-brand font-semibold">
                      {category.name}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        hoveredCategory?._id === category._id
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </Link>

                  <AnimatePresence>
                    {hoveredCategory?._id === category._id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full shadow-lg rounded-md mt-1 z-10"
                      >
                        {category.subCategories.map((sub) => (
                          <div
                            key={sub._id}
                            className="relative hover:bg-secondary"
                            onMouseEnter={() => setHoveredSubCategory(sub)}
                            onMouseLeave={() => setHoveredSubCategory(null)}
                          >
                            <Link
                              to={`/products?category=${category._id}&subcategory=${sub._id}`}
                              className="p-3 cursor-pointer flex items-center justify-between"
                              onClick={onClose}
                            >
                              <span className="text-gray-700">{sub.name}</span>
                            </Link>
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
    </>
  );
};

export default ProductDropdown;
