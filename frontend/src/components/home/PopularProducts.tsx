import React from "react";
import FeaturedProductsHeader from "../common/FeaturedProductsHeader";
import FeaturedProductsCarousel from "../common/FeaturedProductsCarousel";

const FeaturedProducts: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <FeaturedProductsHeader title="Popular Products" link="See All" />
      <FeaturedProductsCarousel />
    </div>
  );
};

export default FeaturedProducts;
