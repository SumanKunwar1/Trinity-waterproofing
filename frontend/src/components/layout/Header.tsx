import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { LuShoppingCart } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa"; // Import wishlist icon
import { navigationItems } from "../../constants/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext"; // Import the useWishlist hook
import ProductDropdown from "./ProductDropdown";
import { categories } from "../../constants/categories";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card"; // Import Shadcn HoverCard components

const Header: React.FC = () => {
  const { cartItems } = useCart();
  const { wishlist } = useWishlist(); // Access wishlist items from WishlistContext
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false); // Added state for product dropdown

  const cartItemCount = cartItems.length;
  const wishlistItemCount = wishlist.length; // Get the number of items in the wishlist

  return (
    <header className="bg-brand shadow-md relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="h-16 w-16 sm:block hidden">
            <img
              src="/assets/logo.png"
              alt="Brand Logo"
              className="h-16 w-16"
            />
          </Link>

          {/* Brand name - Only visible on medium (md) and larger screens */}
          <Link to="/" className="hidden md:block">
            <span className="text-2xl font-bold text-hover">
              Trinity Waterproofing
            </span>
          </Link>
        </div>
        <div
          className={`flex items-center ${
            isSearchOpen ? "justify-center " : "space-x-3"
          }`}
        >
          {/* Navigation Links */}
          {!isSearchOpen && (
            <nav
              className={`hidden md:flex space-x-6 ${
                isSearchOpen ? "hidden" : "block"
              }`}
            >
              {navigationItems.map((item) =>
                item.title === "Products" ? (
                  <HoverCard
                    key={item.id}
                    open={isHovered}
                    onOpenChange={setIsHovered}
                  >
                    <HoverCardTrigger>
                      <button className="text-white font-semibold hover:text-secondary transition-colors duration-300 flex items-center">
                        {item.title}
                        <FaChevronDown className="ml-1" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="border-0 shadow-lg rounded-md  w-screen">
                      <ProductDropdown
                        isOpen={isHovered}
                        onClose={() => setIsHovered(false)}
                      />
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="text-white font-semibold hover:text-secondary transition-colors duration-300"
                  >
                    {item.title}
                  </Link>
                )
              )}
            </nav>
          )}

          {/* Search, User, Cart, and Wishlist Icons */}
          <div className="flex items-center space-x-4">
            {isSearchOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 pl-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <IoCloseOutline size={25} />
                </button>
              </motion.div>
            ) : (
              <>
                {/* Search Icon */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-white p-2 hover:bg-slate-400 rounded-full"
                >
                  <IoSearchOutline size={25} />
                </button>

                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-slate-400 rounded-full"
                >
                  <LuShoppingCart
                    size={25}
                    className="text-hover hover:text-secondary transition-all duration-300"
                  />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Wishlist Icon */}
                <Link
                  to="/wishlist"
                  className="relative p-2 hover:bg-slate-400 rounded-full"
                >
                  <FaRegHeart
                    size={25}
                    className="text-hover hover:text-secondary transition-all duration-300"
                  />
                  {wishlistItemCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs rounded-full">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>
                {/* User Icon */}
                <Link
                  to="/login"
                  className="p-2 hover:bg-slate-400 rounded-full"
                >
                  <FiUser
                    size={25}
                    className="text-hover hover:text-secondary transition-all duration-300"
                  />
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  className="md:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? (
                    <IoCloseOutline size={25} className="text-white" />
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Dropdown */}
      {isOpen && !isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-md"
        >
          <nav className="flex flex-col p-4">
            {navigationItems.map((item) =>
              item.title === "Products" ? (
                <button
                  key={item.id}
                  className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300 text-left flex items-center justify-between w-full"
                  onClick={() =>
                    setIsProductDropdownOpen(!isProductDropdownOpen)
                  }
                >
                  {item.title}
                  <FaChevronDown
                    className={`ml-2 transition-transform duration-300 ${
                      isProductDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              )
            )}
            {isProductDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white shadow-inner"
              >
                <ProductDropdown
                  isOpen={isProductDropdownOpen}
                  onClose={() => setIsProductDropdownOpen(false)}
                />
              </motion.div>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
