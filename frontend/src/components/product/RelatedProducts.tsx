import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import axios from "axios";
import { IProduct } from "../../types/product";
import { toast } from "react-toastify";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: any;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  categoryId,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get<IProduct[]>(
          `/api/product?categoryId=${categoryId}`
        );
        const filteredProducts = response.data.filter(
          (product) => product._id !== currentProductId
        );
        setRelatedProducts(filteredProducts.slice(0, 4));
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          "Failed to fetch related products. Please try again.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, categoryId]);

  if (loading) {
    return <p>Loading related products...</p>;
  }

  // Return null if no related products are found
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              onClick={() => navigate(`/product/${product._id}`)}
              className="cursor-pointer"
            >
              <ProductCard product={product} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
