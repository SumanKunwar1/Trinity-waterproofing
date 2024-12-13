import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaHome, FaBuilding, FaIndustry } from "react-icons/fa";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: FaShieldAlt,
    title: "Coating",
    description: "Complete protection for below-grade spaces",
    link: "/products/",
  },
  {
    icon: FaHome,
    title: "Membranes",
    description: "Superior protection against leaks and moisture",
    link: "/products/",
  },
  {
    icon: FaBuilding,
    title: "Contruction Chemicals",
    description: "Shield your walls from water damage",
    link: "/products/",
  },
  {
    icon: FaIndustry,
    title: "Drainage",
    description: "Heavy-duty waterproofing for industrial spaces",
    link: "/products/",
  },
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Waterproofing Solutions for Every Need
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link
                to={category.link}
                className="block p-6 bg-gray-50 rounded-lg hover:bg-tertiary transition-colors"
              >
                <category.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
                <span className="inline-flex items-center mt-4 text-blue-600 group-hover:translate-x-1 transition-transform">
                  View Products
                  <svg
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
