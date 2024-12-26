import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilter from "../components/products/ProductFilter";
import ProductSort from "../components/products/ProductSort";
import Pagination from "../components/common/Pagination";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import axios from "axios";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  productImage: string;
  image: string[];
  subCategory: ISubCategory;
  features: string;
  brand: string;
  inStock: number;
  review: { rating: number }[];
}

interface ICategory {
  _id: string;
  name: string;
  subCategories: Array<{ _id: string; name: string }>;
}

interface ISubCategory {
  _id: string;
  name: string;
  category: ICategory;
  product: any[];
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
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [productsRes, categoriesRes, subCategoriesRes] =
          await Promise.all([
            axios.get("/api/product"),
            axios.get("/api/category"),
            axios.get("/api/subcategory"),
          ]);

        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setSubCategories(subCategoriesRes.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
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
    let filtered = [...products];

    console.log("Filters:", filters);

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.subCategory.category._id === filters.category
      );
    }

    // Filter by subcategory
    if (filters.subcategory) {
      filtered = filtered.filter(
        (product) => product.subCategory._id === filters.subcategory
      );
    }

    // Filter by price
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filtered = filtered.filter((product) => {
        const price =
          userRole === "b2b" ? product.wholeSalePrice : product.retailPrice;
        return price >= filters.minPrice && price <= filters.maxPrice;
      });
    }

    // Filter by rating
    if (filters.rating && filters.rating.length > 0) {
      filtered = filtered.filter((product) => {
        if (product.review.length === 0) return false;

        const avgRating =
          product.review.reduce((acc, review) => acc + review.rating, 0) /
          product.review.length;
        return filters.rating.includes(Math.floor(avgRating));
      });
    }

    // Filter by stock
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock > 0);
    }

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerSearchTerm) ||
          product.description.toLowerCase().includes(lowerSearchTerm) ||
          product.brand.toLowerCase().includes(lowerSearchTerm)
      );
    }

    console.log("Filtered Products:", filtered);
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProducts];

    switch (option) {
      case "price_asc":
        sorted.sort((a, b) => {
          const priceA = userRole === "b2b" ? a.wholeSalePrice : a.retailPrice;
          const priceB = userRole === "b2b" ? b.wholeSalePrice : b.retailPrice;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        sorted.sort((a, b) => {
          const priceA = userRole === "b2b" ? a.wholeSalePrice : a.retailPrice;
          const priceB = userRole === "b2b" ? b.wholeSalePrice : b.retailPrice;
          return priceB - priceA;
        });
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
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
              <input
                type="text"
                placeholder="Search products..."
                className="p-2 border rounded w-full mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
