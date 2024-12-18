import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilter from "../components/products/ProductFilter";
import ProductSort from "../components/products/ProductSort";
import Pagination from "../components/common/Pagination";
import { products } from "../constants/products";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const ITEMS_PER_PAGE = 9;

const ProductListing: React.FC = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole");

  // Function to get the price based on user role
  const getPriceForRole = (product: any) => {
    if (userRole === "b2b") {
      return product.wholesalePrice; // Use wholesale price if available
    }
    return product.retailPrice; // Use retail price if available
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    if (category || subcategory) {
      handleFilter({
        category: category || "",
        subcategory: subcategory || "",
        minPrice: 0,
        maxPrice: 1000,
        rating: [],
        inStock: false,
      });
    }
  }, [location]);

  const handleFilter = (filters: any) => {
    let filtered = products;

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.categoryId === parseInt(filters.category)
      );
    }

    if (filters.subcategory) {
      filtered = filtered.filter(
        (product) => product.subcategoryId === parseInt(filters.subcategory)
      );
    }

    // Apply price range filter with adjusted prices based on role
    filtered = filtered.filter(
      (product) =>
        getPriceForRole(product) >= filters.minPrice &&
        getPriceForRole(product) <= filters.maxPrice
    );

    if (filters.rating.length > 0) {
      filtered = filtered.filter((product) =>
        filters.rating.includes(Math.floor(product.averageRating))
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProducts];

    switch (option) {
      case "price_asc":
        sorted.sort((a, b) => getPriceForRole(a) - getPriceForRole(b));
        break;
      case "price_desc":
        sorted.sort((a, b) => getPriceForRole(b) - getPriceForRole(a));
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Our Products</h1>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <ProductFilter onFilter={handleFilter} />
            </div>
            <div className="w-full md:w-3/4 md:pl-5">
              <ProductSort onSort={handleSort} />
              <ProductGrid
                products={currentItems.map((product) => ({
                  ...product,
                  price: getPriceForRole(product), // Adjust price based on role
                }))}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
