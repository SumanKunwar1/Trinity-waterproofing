import React from "react";
import { motion } from "framer-motion";
import ProductCard from "../common/ProductCard";
import { products } from "../../constants/products";

interface RelatedProductsProps {
  currentProductId: number;
  categoryId: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  categoryId,
}) => {
  const relatedProducts = products
    .filter(
      (product) =>
        product.categoryId === categoryId && product.id !== currentProductId
    )
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return <p>No related products found in this category.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
