import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "../common/ProductCard";
import { products } from "../../constants/products";

const FeaturedProductsCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.slice(0, 8);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoints
  const getResponsiveSlidesPerView = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 4;
    if (width >= 640) return 3;
    if (width >= 480) return 2;
    return 1;
  };

  const [slidesPerView, setSlidesPerView] = useState(
    getResponsiveSlidesPerView()
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getResponsiveSlidesPerView());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll functionality (one direction only)
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide, slidesPerView, featuredProducts.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      (prev + 1) * slidesPerView >= featuredProducts.length ? 0 : prev + 1
    );
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0
        ? Math.floor((featuredProducts.length - 1) / slidesPerView)
        : prev - 1
    );
  };

  // Calculate total number of slides
  const totalSlides = Math.ceil(featuredProducts.length / slidesPerView);

  return (
    <div className="relative w-full pb-6">
      {/* Carousel Container */}
      <div className="overflow-hidden relative">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
          }}
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: `${100 / slidesPerView}%` }}
            >
              <motion.div
                className="p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ProductCard product={product} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevSlide}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
        >
          <FaChevronLeft />
        </button>

        {/* Pagination Dots */}
        <div className="flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full ${
                currentSlide === index ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextSlide}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;
