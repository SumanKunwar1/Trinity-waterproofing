import React, { useState, useEffect, useCallback } from "react";
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
import { IProduct } from "../types/product";
import { Brand } from "../types/brand";
import { Category } from "../types/category";

const ITEMS_PER_LOAD = 15;

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
  const [hasMore, setHasMore] = useState(true);

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
      const subcategories = getFilteredSubcategories(categoryId);
      const priceKey = userRole === "b2b" ? "wholeSalePrice" : "retailPrice";
      let maxPrice = 0;

      subcategories.forEach((subcategory) => {
        // console.log("subcategory", subcategory);
        subcategory.products.forEach((product) => {
          const price = product[priceKey as keyof IProduct] as number;
          if (price > maxPrice) {
            maxPrice = price;
          }
        });
      });

      return maxPrice || 1000; // Default to 1000 if no products found
    },
    [getFilteredSubcategories, userRole]
  );

  const applyFilters = useCallback(
    (filters: FilterOptions) => {
      let filtered = [...products];

      if (filters.category && filters.category !== "all") {
        filtered = filtered.filter(
          (product) => product.subCategory.category._id === filters.category
        );
      }

      if (filters.subcategory && filters.subcategory !== "all") {
        filtered = filtered.filter(
          (product) => product.subCategory._id === filters.subcategory
        );
      }

      if (filters.brands && filters.brands.length > 0) {
        filtered = filtered.filter((product) =>
          filters.brands.includes(product.brand._id)
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
      setDisplayedProducts(filtered.slice(0, ITEMS_PER_LOAD));
      setHasMore(filtered.length > ITEMS_PER_LOAD);
    },
    [products, userRole]
  );

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
        setFilteredProducts(productsRes.data);
        setDisplayedProducts(productsRes.data.slice(0, ITEMS_PER_LOAD));
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
        setHasMore(productsRes.data.length > ITEMS_PER_LOAD);

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

    if (category && category !== "all") {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    if (subcategory && subcategory !== "all") {
      setSelectedSubcategory(subcategory);
    } else {
      setSelectedSubcategory(null);
    }

    const filters: FilterOptions = {
      category: category || null,
      subcategory: subcategory || null,
      minPrice: 0,
      maxPrice: category ? getMaxPrice(category) : 1000,
      rating: [],
      inStock: false,
      brands: brands || [],
    };

    applyFilters(filters);
  }, [location, applyFilters, getMaxPrice]);

  const handleFilter = (filters: FilterOptions) => {
    applyFilters(filters);
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
    setDisplayedProducts(sorted.slice(0, ITEMS_PER_LOAD));
    setHasMore(sorted.length > ITEMS_PER_LOAD);
    setIsSortOpen(false);
  };

  const handleLoadMore = () => {
    const currentLength = displayedProducts.length;
    const nextBatch = filteredProducts.slice(
      currentLength,
      currentLength + ITEMS_PER_LOAD
    );
    setDisplayedProducts([...displayedProducts, ...nextBatch]);
    setHasMore(currentLength + ITEMS_PER_LOAD < filteredProducts.length);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    navigate(categoryId ? `/products?category=${categoryId}` : "/products");
    applyFilters({
      category: categoryId,
      subcategory: null,
      minPrice: 0,
      maxPrice: getMaxPrice(categoryId),
      rating: [],
      inStock: false,
      brands: [],
    });
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    navigate(
      subcategoryId
        ? `/products?category=${selectedCategory}&subcategory=${subcategoryId}`
        : `/products?category=${selectedCategory}`
    );
    applyFilters({
      category: selectedCategory,
      subcategory: subcategoryId,
      minPrice: 0,
      maxPrice: selectedCategory ? getMaxPrice(selectedCategory) : 1000,
      rating: [],
      inStock: false,
      brands: [],
    });
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
                />
              </div>
            </div>

            <div className="w-full md:pl-5">
              <div className="hidden md:block mb-8">
                <ProductSort onSort={handleSort} />
              </div>
              <ProductGrid products={displayedProducts} />
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button onClick={handleLoadMore}>Load More</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
