import { useState, useEffect } from "react";
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
import { LogOut } from "lucide-react";
// Import Sentry
import * as Sentry from "@sentry/react";

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
import { toast } from "react-toastify";

interface IProduct {
  _id: string;
  name: string;
  createdAt: string;
  type: "product";
}

interface ICategory {
  _id: string;
  name: string;
  type: "category";
}

interface ISubcategory {
  _id: string;
  name: string;
  type: "subcategory";
}

type SearchResult = IProduct | ICategory | ISubcategory;

const Header: React.FC = () => {
  const { cart, isLoading: cartLoading } = useCart();
  const { wishlist, isLoading: wishlistLoading } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);

  const navigate = useNavigate();
  const handleLogout = useLogout();
  const userString = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!localStorage.getItem("authToken");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    fetchCategories();
    fetchProducts();
    fetchSubcategories();
    return () => clearTimeout(timer);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");

      // Check if response is successful
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to fetch categories");
      }

      // Parse the JSON response
      const data = await response.json();

      // Process the fetched data
      setCategories(
        data.map((category: ICategory) => ({
          ...category,
          type: "category",
        }))
      );
    } catch (error: any) {
      Sentry.captureException(error);
      const errorMessage = "Failed to fetch categories.";
      toast.error(error.message || errorMessage);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Check if response is successful
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to fetch products");
      }

      // Parse the JSON response
      const data = await response.json();

      // Sort the products by createdAt
      const sortedProducts = data
        .map((product: IProduct) => ({ ...product, type: "product" }))
        .sort(
          (a: IProduct, b: IProduct) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      // Set the products in state
      setProducts(sortedProducts);
    } catch (error: any) {
      Sentry.captureException(error);
      toast.error(error.message || "Failed to fetch products");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch("/api/subcategory");

      // Check if response is successful
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to fetch subcategories");
      }

      // Parse the JSON response
      const data = await response.json();

      // Process the fetched subcategories
      setSubcategories(
        data.map((subcategory: ISubcategory) => ({
          ...subcategory,
          type: "subcategory",
        }))
      );
    } catch (error: any) {
      Sentry.captureException(error);
      toast.error(error.message || "Failed to fetch subcategories");
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const results = [
        ...products.filter((p) =>
          p.name.toLowerCase().includes(term.toLowerCase())
        ),
        ...categories.filter((c) =>
          c.name.toLowerCase().includes(term.toLowerCase())
        ),
        ...subcategories.filter((s) =>
          s.name.toLowerCase().includes(term.toLowerCase())
        ),
      ];
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (item: SearchResult) => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setSearchResults([]);
    switch (item.type) {
      case "product":
        navigate(`/product/${item._id}`);
        break;
      case "category":
        navigate(`/products/${item._id}`);
        break;
      case "subcategory":
        navigate(`/products/${item._id}`);
        break;
    }
  };

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
    <header className="bg-brand shadow-md sticky top-0 z-50">
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
              <Link to="/products" className="gap-4 md:flex">
                {navigationItems.map((item) =>
                  item.title === "Products" ? (
                    <HoverCard
                      key={item.id}
                      open={isHovered}
                      onOpenChange={setIsHovered}
                      openDelay={0}
                      closeDelay={300}
                    >
                      <HoverCardTrigger>
                        <button className="text-white font-semibold hover:text-secondary flex items-center">
                          {item.title}
                          <FaChevronDown
                            className={`ml-2 transition-transform duration-300 ${
                              isHovered ? "rotate-180" : ""
                            }`}
                          />
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
              </Link>
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
                              handleMenuItemClick("/customer/dashboard")
                            }
                          >
                            Dashboard
                          </DropdownMenuItem>
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
                            <LogOut className="mr-2 h-4 w-4" />
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
                        placeholder="Search products, categories, or subcategories..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
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

      {/* Search results */}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-b-md max-h-96 overflow-y-auto">
          {searchResults.map((item) => (
            <div
              key={item._id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleSearchResultClick(item)}
            >
              <span className="mr-2 text-xs text-gray-500">{item.type}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-md absolute left-0 right-0 top-full z-40 overflow-y-auto "
          >
            <nav className="flex flex-col p-4 h-[calc(100vh-6rem)]">
              {/* Navigation Items */}
              {navigationItems.map((item) =>
                item.title === "Products" ? (
                  <div key={item.id} className="relative">
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
                    <AnimatePresence>
                      {isProductDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="absolute left-0 top-full bg-gray-50 rounded-md mt-1 shadow-md z-50 w-full"
                        >
                          <ProductDropdown
                            isOpen={isProductDropdownOpen}
                            onClose={() => setIsProductDropdownOpen(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
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

              {/* Add search input for mobile */}
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.map((item) => (
                        <div
                          key={item._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleSearchResultClick(item);
                            setIsOpen(false);
                          }}
                        >
                          <span className="text-sm text-gray-700">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
                    to="/customer/dashboard"
                    className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/customer/notifications"
                    className="text-gray-600 hover:text-blue-600 py-2 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Notifications
                  </Link>
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
