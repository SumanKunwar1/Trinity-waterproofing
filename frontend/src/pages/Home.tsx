import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PopularProducts from "../components/home/PopularProducts";
import BrandSection from "../components/common/BrandSection";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div>
          <HeroSection />
          <FeaturedCategories />
          <FeaturedProducts />
          <PopularProducts />
          <BrandSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
