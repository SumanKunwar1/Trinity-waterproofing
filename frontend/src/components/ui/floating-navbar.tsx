import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Use this if using React Router

interface NavItem {
  name: string;
  link: string;
}

interface FloatingNavbarProps {
  navItems: NavItem[];
}

const FloatingNavbar: React.FC<FloatingNavbarProps> = ({ navItems }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <ul className="flex space-x-1 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2">
        {navItems.map((item) => (
          <li key={item.name}>
            {/* Replace Link with <a> if not using React Router */}
            <Link to={item.link}>
              <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition duration-150 ease-in-out">
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default FloatingNavbar;
