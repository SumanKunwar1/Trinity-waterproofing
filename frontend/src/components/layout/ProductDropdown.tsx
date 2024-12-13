import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../../constants/categories";

interface ProductDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({
  isOpen,
  onClose,
}) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="mb-6">
              <h3 className="text-xl text-brand font-semibold mb-4">
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <Link
                      to={`/products?category=${category.id}&subcategory=${subcategory.id}`}
                      className="text-gray-800 hover:text-secondary transition-all duration-300 block py-2"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDropdown;
