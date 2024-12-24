import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilter from "../components/products/ProductFilter";
import ProductSort from "../components/products/ProductSort";
import Pagination from "../components/common/Pagination";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import axios from "axios";

interface IColor {
  name: string;
  hex: string;
}

interface IProduct {
  _id: string;
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  productImage: string;
  image: string[];
  subCategory: string;
  features: string;
  brand: string;
  colors?: IColor[];
  inStock: number;
  review: { rating: number }[];
}

const ITEMS_PER_PAGE = 9;

const ProductListing: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);

  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get("/api/subcategory");
        setSubCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchSubCategories();
  }, []);

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
  }, [location, products]);

  const handleFilter = (filters: any) => {
    let filtered = products;

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.subCategory.toString() === filters.category
      );
    }

    if (filters.subcategory) {
      filtered = filtered.filter(
        (product) => product.subCategory.toString() === filters.subcategory
      );
    }

    filtered = filtered.filter(
      (product) =>
        (userRole === "b2b" ? product.wholeSalePrice : product.retailPrice) >=
          filters.minPrice &&
        (userRole === "b2b" ? product.wholeSalePrice : product.retailPrice) <=
          filters.maxPrice
    );

    if (filters.rating.length > 0) {
      filtered = filtered.filter((product) => {
        const avgRating =
          product.review.reduce((acc, review) => acc + review.rating, 0) /
          product.review.length;
        return filters.rating.includes(Math.floor(avgRating));
      });
    }

    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock > 0);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProducts];

    switch (option) {
      case "price_asc":
        sorted.sort((a, b) =>
          userRole === "b2b"
            ? a.wholeSalePrice - b.wholeSalePrice
            : a.retailPrice - b.retailPrice
        );
        break;
      case "price_desc":
        sorted.sort((a, b) =>
          userRole === "b2b"
            ? b.wholeSalePrice - a.wholeSalePrice
            : b.retailPrice - a.retailPrice
        );
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Our Products</h1>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <ProductFilter
                onFilter={handleFilter}
                categories={categories}
                subCategories={subCategories}
              />
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
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
