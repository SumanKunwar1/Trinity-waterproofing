import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import Loader from "../common/Loader";
import { User } from "../../types/user";
import { useLogout } from "../../utils/authUtils";

const Header: React.FC = () => {
  const { cart, isLoading: cartLoading } = useCart();
  const { wishlist, isLoading: wishlistLoading } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const handleLogout = useLogout();
  const userString = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  const userRole = localStorage.getItem("userRole");
  const isLoggedIn = !!localStorage.getItem("authToken");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getInitials = (name?: string) => {
    if (!name || name.trim() === "") return "N/A";
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("")
      .substr(0, 2);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const cartItemCount = cart?.length || 0;
  const wishlistItemCount = wishlist?.length || 0;

  if (isLoading || cartLoading || wishlistLoading) {
    return <Loader />;
  }

  return (
    <header className="bg-brand shadow-md relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="h-16 w-16">
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

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden gap-4 md:flex">
              {navigationItems.map((item) =>
                item.title === "Products" ? (
                  <HoverCard
                    key={item.id}
                    open={isHovered}
                    onOpenChange={setIsHovered}
                  >
                    <HoverCardTrigger>
                      <button className="text-white font-semibold hover:text-secondary flex items-center">
                        {item.title}
                        <FaChevronDown className="ml-1" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="border-0 shadow-lg rounded-md w-screen">
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
                    className="text-white font-semibold hover:text-secondary transition-colors"
                  >
                    {item.title}
                  </Link>
                )
              )}
            </nav>

            {/* Right Section - Icons */}
            <div className="flex items-center space-x-4 ">
              {!isSearchOpen ? (
                <>
                  {/* Always visible icons */}
                  <button
                    onClick={() =>
                      isLoggedIn ? navigate("/cart") : navigate("/login")
                    }
                    className="relative p-2 hover:bg-slate-400 rounded-full"
                  >
                    <LuShoppingCart
                      size={25}
                      className="text-hover hover:text-secondary transition-all duration-300"
                    />
                    {isLoggedIn && cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs rounded-full">
                        {cartItemCount}
                      </span>
                    )}
                  </button>

                  {/* Desktop-only icons */}
                  <div className="hidden md:flex items-center space-x-4">
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="text-white p-2 hover:bg-slate-400 rounded-full"
                    >
                      <IoSearchOutline size={25} />
                    </button>

                    <button
                      onClick={() =>
                        isLoggedIn ? navigate("/wishlist") : navigate("/login")
                      }
                      className="relative p-2 hover:bg-slate-400 rounded-full"
                    >
                      <FaRegHeart
                        size={25}
                        className="text-hover hover:text-secondary transition-all duration-300"
                      />
                      {isLoggedIn && wishlistItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs rounded-full">
                          {wishlistItemCount}
                        </span>
                      )}
                    </button>

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
                            <div className="flex flex-col ">
                              <span className="font-medium">
                                {user.fullName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.email}
                              </span>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="border-b border-gray-200 mx-1" />
                          <DropdownMenuItem
                            className="text-brand cursor-pointer py-2 border-b border-gray-200 hover:text-secondary transition-all duration-300"
                            onSelect={() =>
                              handleMenuItemClick("/customer/notifications")
                            }
                          >
                            Notifications
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-brand cursor-pointer py-2 border-b border-gray-200 hover:text-secondary transition-all duration-300"
                            onSelect={() =>
                              handleMenuItemClick("/customer/purchase-history")
                            }
                          >
                            Order History
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-brand cursor-pointer py-2 border-b border-gray-200 hover:text-secondary transition-all duration-300"
                            onSelect={() =>
                              handleMenuItemClick("/customer/manage-profile")
                            }
                          >
                            Manage Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 border rounded-2xl border-red-600 text-center hover:bg-tertiary flex justify-center cursor-pointer focus:text-red-700 transition-all duration-300"
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
                  </div>

                  {/* Hamburger Menu - Mobile only */}
                  <button
                    className="md:hidden p-2 hover:bg-slate-400 rounded-full"
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
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-0 left-0 w-full h-full bg-brand flex items-center justify-center px-4"
                  >
                    <div className="relative w-full max-w-md">
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
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-md"
          >
            <nav className="flex flex-col p-4">
              {/* Search in mobile menu */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsOpen(false);
                }}
                className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300 flex items-center"
              >
                <IoSearchOutline className="mr-2" />
                Search
              </button>

              {/* Navigation Items */}
              {navigationItems.map((item) =>
                item.title === "Products" ? (
                  <div key={item.id}>
                    <button
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
                    {isProductDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 rounded-md mt-2"
                      >
                        <ProductDropdown
                          isOpen={isProductDropdownOpen}
                          onClose={() => setIsProductDropdownOpen(false)}
                        />
                      </motion.div>
                    )}
                  </div>
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

              {/* Wishlist in mobile menu */}
              <Link
                to={isLoggedIn ? "/wishlist" : "/login"}
                className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <FaRegHeart className="mr-2" />
                Wishlist
                {isLoggedIn && wishlistItemCount > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>

              {/* User Menu Items */}
              {user ? (
                <>
                  <div className="py-2 text-gray-600">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <Link
                    to="/customer/purchase-history"
                    className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Order History
                  </Link>
                  <Link
                    to="/customer/manage-profile"
                    className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Manage Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 py-2 transition-colors duration-300 text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="mr-2" />
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
