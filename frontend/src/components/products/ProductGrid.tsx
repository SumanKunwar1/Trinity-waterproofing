import React from "react";
import ProductCard from "../common/ProductCard";
import { IProduct } from "../../types/product";

interface ProductGridProps {
  products: IProduct[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
