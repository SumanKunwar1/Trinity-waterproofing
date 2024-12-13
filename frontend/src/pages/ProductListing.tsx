import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilter from "../components/products/ProductFilter";
import ProductSort from "../components/products/ProductSort";
import Pagination from "../components/common/Pagination";
import { products } from "../constants/products";

const ITEMS_PER_PAGE = 9;

const ProductListing: React.FC = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    if (category || subcategory) {
      handleFilter({
        category: category || "",
        subcategory: subcategory || "",
        priceRange: "",
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

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProducts];
    switch (option) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-8 md:mb-0">
          <ProductFilter onFilter={handleFilter} />
        </div>
        <div className="w-full md:w-3/4 md:pl-5">
          <ProductSort onSort={handleSort} />
          <ProductGrid products={currentItems} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
