import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PopularProducts from "../components/home/PopularProducts";
import BrandSection from "../components/common/BrandSection";

const Home: React.FC = () => {
  const brands = [
    "/assets/dr-fixit.png",
    "/assets/fevicol.png",
    "/assets/makphalt.png",
    "/assets/semitrone.jpg",
    "/assets/dr-fixit.png",
    "/assets/fevicol.png",
    "/assets/makphalt.png",
    "/assets/semitrone.jpg",
  ];
  return (
    <div>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <PopularProducts />
      <BrandSection brands={brands} />
    </div>
  );
};

export default Home;
