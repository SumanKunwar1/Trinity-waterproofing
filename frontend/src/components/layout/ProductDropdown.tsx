import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

interface ProductDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}
interface Category {
  _id: string;
  name: string;
  description?: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
  products: Product[]; // Each subCategory directly contains products
}

interface Product {
  _id: string;
  name: string;
  brand: { _id: string; name: string };
  retailPrice: number;
  wholeSalePrice: number;
  inStock: number;
  colors: { name: string; hex: string }[];
  description: string;
  features: string;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch categories with subcategories and products
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
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

  // Debugging: Console log categories, subcategories, and products
  console.log("Mapped categories with looped products:");
  categories.forEach((category) => {
    console.log(`Category: ${category.name}`);
    category.subCategories.forEach((sub) => {
      console.log(`  SubCategory: ${sub.name}`);
      sub.products.forEach((prod) => {
        console.log(`    Product: ${prod.name}`);
      });
    });
  });

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
              <div key={category._id} className="mb-6">
                <h3 className="text-xl text-brand font-semibold mb-4">
                  {category.name}
                </h3>
                {category.subCategories.length > 0 ? (
                  category.subCategories.map((sub) => (
                    <div key={sub._id} className="ml-4">
                      <h4 className="text-lg text-gray-700 mb-2">{sub.name}</h4>
                      {sub.products.length > 0 ? (
                        <ul className="space-y-2">
                          {sub.products.map((product) => (
                            <li key={product._id}>
                              <Link
                                to={`/product/${product._id}`}
                                className="text-gray-800 hover:text-secondary transition-all duration-300 block py-2"
                                onClick={() => onClose()}
                              >
                                {product.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 ml-4">
                          No products available.
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No subcategories available.</p>
                )}
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
