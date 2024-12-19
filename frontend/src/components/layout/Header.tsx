import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { LuShoppingCart } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { navigationItems } from "../../constants/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductDropdown from "./ProductDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";
import { Avatar, AvatarFallback } from "../ui/avatar";

// Define a type for the user object
interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  number: string;
  createdAt: string;
}

const Header: React.FC = () => {
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // Retrieve user information from localStorage
  const userString = localStorage.getItem("user");
  const userName = localStorage.getItem("userFullName");
  const user: User | null = userString ? JSON.parse(userString) : null;

  // Generate initials
  const getInitials = (name?: string) => {
    if (!name || name.trim() === "") {
      return "N/A"; // Default initials if name is missing or empty
    }
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("")
      .substr(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");
    localStorage.removeItem("userNumber");
    window.location.reload();
    // Redirect to login page
    navigate("/login");
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const cartItemCount = cartItems.length;
  const wishlistItemCount = wishlist.length;
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

          <Link to="/" className="hidden md:block">
            <span className="text-2xl font-bold text-hover">
              Trinity Waterproofing
            </span>
          </Link>
        </div>

        <div
          className={`flex items-center ${
            isSearchOpen ? "justify-center" : "space-x-3"
          }`}
        >
          {/* Navigation Links */}
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

                {/* User Avatar or Login */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer">
                        <Avatar>
                          <AvatarFallback className="bg-orange-500 text-white font-bold">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.fullName}</span>
                          <span className="text-xs text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-brand cursor-pointer hover:text-secondary transition-all duration-300"
                        onSelect={() =>
                          handleMenuItemClick("/customer/purchase-history")
                        }
                      >
                        Order History
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-brand cursor-pointer hover:text-secondary transition-all duration-300"
                        onSelect={() =>
                          handleMenuItemClick("/customer/manage-profile")
                        }
                      >
                        Manage Profile
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 border border-red-600 text-center align-middle hover:bg-tertiary flex justify-center hover:text-brand cursor-pointer focus:text-red-700 transition-all duration-300"
                        onSelect={handleLogout}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 hover:bg-slate-400 rounded-full"
                  >
                    <FiUser
                      size={25}
                      className="text-hover hover:text-secondary transition-all duration-300"
                    />
                  </Link>
                )}

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

      {/* Mobile Navigation Dropdown */}
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
