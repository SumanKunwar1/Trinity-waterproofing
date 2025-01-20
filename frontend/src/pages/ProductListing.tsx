import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilter from "../components/products/ProductFilter";
import ProductSort from "../components/products/ProductSort";
import Pagination from "../components/common/Pagination";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Loader from "../components/common/Loader";
import { IProduct } from "../types/product";
import { Brand } from "../types/brand";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { FilterIcon, ListOrderedIcon as SortIcon } from "lucide-react";
const ITEMS_PER_PAGE = 9;

interface Category {
  _id: string;
  name: string;
  description?: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
  description?: string;
  category: string;
  products: Product[];
}

interface IColor {
  name: string;
  hex: string;
}

interface IReview {
  rating: number;
  content: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  retailDiscountedPrice?: number;
  wholeSaleDiscountedPrice?: number;
  productImage: string;
  image: string[];
  subCategory: string;
  pdfUrl: string;
  features: string[];
  brand: string | Brand;
  createdAt: string;
  colors?: IColor[];
  inStock: number;
  review: IReview[];
}

interface FilterOptions {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  inStock: boolean;
}

const ProductListing: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const userRole = localStorage.getItem("userRole");
  const isLoggedIn = !!localStorage.getItem("authToken");
  const unParsedUserId = localStorage.getItem("userId");
  let userId: string | null = null;

  if (unParsedUserId) {
    try {
      userId = JSON.parse(unParsedUserId);
    } catch (error) {
      // console.error("Error parsing userId:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let productsRes;
        if (isLoggedIn && userId) {
          productsRes = await axios.get(`/api/product/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
        } else {
          productsRes = await axios.get("/api/product");
        }

        const [categoriesRes] = await Promise.all([axios.get("/api/category")]);

        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data);

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

  const handleFilter = (filters: FilterOptions) => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.subCategory.category._id === filters.category
      );
    }

    if (filters.subcategory) {
      filtered = filtered.filter(
        (product) => product.subCategory._id === filters.subcategory
      );
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filtered = filtered.filter((product) => {
        const price =
          userRole === "b2b" ? product.wholeSalePrice : product.retailPrice;
        return price >= filters.minPrice && price <= filters.maxPrice;
      });
    }

    if (filters.rating && filters.rating.length > 0) {
      filtered = filtered.filter((product) => {
        if (product.review.length === 0) return false;

        const avgRating =
          product.review.reduce((acc, review) => acc + review.rating, 0) /
          product.review.length;
        return filters.rating.some((rating) => avgRating >= rating);
      });
    }

    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock > 0);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleSort = (option: string) => {
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
                />
              </div>
            </div>

            <div className="w-full  md:pl-5">
              <div className="hidden md:block mb-8">
                <ProductSort onSort={handleSort} />
              </div>
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
