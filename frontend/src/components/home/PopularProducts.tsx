import FeaturedProductsHeader from "../common/FeaturedProductsHeader";
import PopularProductsCarousel from "../common/PopularProductsCarousel";

const FeaturedProducts: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <FeaturedProductsHeader title="Popular Products" link="See All" />
      <PopularProductsCarousel />
    </div>
  );
};

export default FeaturedProducts;
