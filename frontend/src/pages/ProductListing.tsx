import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilter from "../components/products/ProductFilter";
import ProductSort from "../components/products/ProductSort";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Loader from "../components/common/Loader";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { FilterIcon, ListOrderedIcon as SortIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import type { IProduct } from "../types/product";
import type { Brand } from "../types/brand";
import type { Category } from "../types/category";

const ITEMS_PER_PAGE = 15;

interface FilterOptions {
  category: string | null;
  subcategory: string | null;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  rating: number[];
  inStock: boolean;
}

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    subcategory: null,
    brands: [],
    minPrice: 0,
    maxPrice: 1000,
    rating: [],
    inStock: false,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const isLoggedIn = !!localStorage.getItem("authToken");
  const userId = JSON.parse(localStorage.getItem("userId") || "null");

  const getFilteredSubcategories = useCallback(
    (categoryId: string) => {
      const category = categories.find((cat) => cat._id === categoryId);
      return category ? category.subCategories : [];
    },
    [categories]
  );

  const getMaxPrice = useCallback(
    (categoryId: string): number => {
      if (categoryId === "all" || !categoryId) {
        return Math.max(
          ...products.map((p) =>
            userRole === "b2b" ? p.wholeSalePrice : p.retailPrice
          )
        );
      }
      const subcategories = getFilteredSubcategories(categoryId);
      const priceKey = userRole === "b2b" ? "wholeSalePrice" : "retailPrice";
      let maxPrice = 0;

      subcategories.forEach((subcategory) => {
        subcategory.products.forEach((product) => {
          const price = product[priceKey as keyof IProduct] as number;
          if (price > maxPrice) {
            maxPrice = price;
          }
        });
      });

      return maxPrice || 1000;
    },
    [getFilteredSubcategories, userRole, products]
  );

  const applyFilters = useCallback(
    (currentFilters: FilterOptions) => {
      let filtered = [...products];

      if (currentFilters.category && currentFilters.category !== "all") {
        filtered = filtered.filter(
          (product) =>
            product.subCategory.category._id === currentFilters.category
        );
      }

      if (currentFilters.subcategory && currentFilters.subcategory !== "all") {
        filtered = filtered.filter(
          (product) => product.subCategory._id === currentFilters.subcategory
        );
      }

      if (currentFilters.brands && currentFilters.brands.length > 0) {
        filtered = filtered.filter((product) =>
          currentFilters.brands.includes(product.brand._id)
        );
      }

      filtered = filtered.filter((product) => {
        const price =
          userRole === "b2b" ? product.wholeSalePrice : product.retailPrice;
        return (
          price >= currentFilters.minPrice && price <= currentFilters.maxPrice
        );
      });

      if (currentFilters.rating && currentFilters.rating.length > 0) {
        filtered = filtered.filter((product) => {
          if (product.review.length === 0) return false;
          const avgRating =
            product.review.reduce((acc, review) => acc + review.rating, 0) /
            product.review.length;
          return currentFilters.rating.some((rating) => avgRating >= rating);
        });
      }

      if (currentFilters.inStock) {
        filtered = filtered.filter((product) => product.inStock > 0);
      }

      setFilteredProducts(filtered);
      setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
      setCurrentPage(1);
    },
    [products, userRole]
  );

  const updateDisplayedProducts = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let productsRes;
        if (isLoggedIn && userId) {
          productsRes = await axios.get<IProduct[]>(
            `/api/product/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
        } else {
          productsRes = await axios.get<IProduct[]>("/api/product");
        }

        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get<Category[]>("/api/category"),
          axios.get<Brand[]>("/api/brand", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const brands = searchParams.getAll("brand");

    setFilters((prevFilters) => ({
      ...prevFilters,
      category: category || "all", // Default to "all" if `null`
      subcategory: subcategory || null,
      brands: brands,
      maxPrice: category ? getMaxPrice(category) : getMaxPrice("all"),
    }));

    setSelectedCategory(category && category !== "all" ? category : null);
    setSelectedSubcategory(
      subcategory && subcategory !== "all" ? subcategory : null
    );
  }, [location, getMaxPrice]);

  useEffect(() => {
    if (products.length > 0) {
      applyFilters(filters);
    }
  }, [products, filters, applyFilters]);

  useEffect(() => {
    updateDisplayedProducts();
  }, [currentPage, filteredProducts, updateDisplayedProducts]);

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleSort = (option: string) => {
    const sorted = [...filteredProducts];

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
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "discount_desc":
        sorted.sort((a, b) => {
          const discountA =
            userRole === "b2b"
              ? (a.wholeSalePrice -
                  (a.wholeSaleDiscountedPrice || a.wholeSalePrice)) /
                a.wholeSalePrice
              : (a.retailPrice - (a.retailDiscountedPrice || a.retailPrice)) /
                a.retailPrice;
          const discountB =
            userRole === "b2b"
              ? (b.wholeSalePrice -
                  (b.wholeSaleDiscountedPrice || b.wholeSalePrice)) /
                b.wholeSalePrice
              : (b.retailPrice - (b.retailDiscountedPrice || b.retailPrice)) /
                b.retailPrice;
          return discountB - discountA;
        });
        break;
    }

    setFilteredProducts(sorted);
    setCurrentPage(1);
    setIsSortOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (categoryId: string) => {
    const isAllCategories = categoryId === "all";
    setSelectedCategory(isAllCategories ? null : categoryId);
    setSelectedSubcategory(null);
    navigate(
      isAllCategories ? "/products" : `/products?category=${categoryId}`
    );

    setFilters((prevFilters) => ({
      ...prevFilters,
      category: isAllCategories ? "all" : categoryId, // Default to "all" if `null`
      subcategory: null,
      maxPrice: getMaxPrice(categoryId),
    }));
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    navigate(
      subcategoryId && subcategoryId !== "all"
        ? `/products?category=${selectedCategory}&subcategory=${subcategoryId}`
        : `/products?category=${selectedCategory}`
    );

    setFilters((prevFilters) => ({
      ...prevFilters,
      subcategory: subcategoryId !== "all" ? subcategoryId : null,
    }));
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Our Products</h1>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <div className="md:hidden flex justify-between mb-4">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-1/2 mr-2">
                      <FilterIcon className="mr-2 h-4 w-4" /> Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-full sm:w-[380px] border-0 p-6"
                  >
                    <ProductFilter
                      onFilter={handleFilter}
                      categories={categories}
                      brands={brands}
                      selectedCategory={selectedCategory}
                      selectedSubcategory={selectedSubcategory}
                      onCategoryChange={handleCategoryChange}
                      onSubcategoryChange={handleSubcategoryChange}
                      getMaxPrice={getMaxPrice}
                      currentFilters={filters}
                    />
                  </SheetContent>
                </Sheet>
                <Sheet open={isSortOpen} onOpenChange={setIsSortOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-1/2 ml-2">
                      <SortIcon className="mr-2 h-4 w-4" /> Sort
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:w-[380px] border-0 p-6"
                  >
                    <ProductSort onSort={handleSort} />
                  </SheetContent>
                </Sheet>
              </div>
              <div className="hidden md:block">
                <ProductFilter
                  onFilter={handleFilter}
                  categories={categories}
                  brands={brands}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={handleSubcategoryChange}
                  getMaxPrice={getMaxPrice}
                  currentFilters={filters}
                />
              </div>
            </div>

            <div className="w-full md:pl-5">
              <div className="hidden md:block mb-8">
                <ProductSort onSort={handleSort} />
              </div>
              <ProductGrid products={displayedProducts} />
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={pageNumber === currentPage}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (
                        (pageNumber === currentPage - 2 && pageNumber > 2) ||
                        (pageNumber === currentPage + 2 &&
                          pageNumber < totalPages - 1)
                      ) {
                        return <PaginationEllipsis key={pageNumber} />;
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
