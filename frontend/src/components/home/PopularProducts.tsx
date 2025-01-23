import FeaturedProductsHeader from "../common/FeaturedProductsHeader";
import PopularProductsCarousel from "../common/PopularProductsCarousel";
import { useState, useEffect } from "react";
import type { IProduct } from "../../types/product";
import axios from "axios";
const FeaturedProducts: React.FC = () => {
  const [popularProducts, setPopularProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get("/api/product/popular-products");
        setPopularProducts(response.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch popular products.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!popularProducts.length) {
    return <></>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <FeaturedProductsHeader title="Popular Products" link="See All" />
      <PopularProductsCarousel />
    </div>
  );
};

export default FeaturedProducts;
