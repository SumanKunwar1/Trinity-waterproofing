import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FeaturedProductsHeader from "./FeaturedProductsHeader";

interface BrandSectionProps {
  brands: string[]; // Array of brand image URLs
}

const BrandSection: React.FC<BrandSectionProps> = ({ brands }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5; // Number of logos to display at once

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < brands.length) {
      setCurrentIndex(currentIndex + 1); // Move by one logo at a time
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Move back by one logo at a time
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FeaturedProductsHeader title="Associated Brands" />
      <div className="flex items-center justify-center w-full my-8">
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="p-2 text-gray-500 hover:text-gray-900"
          >
            <FaChevronLeft size={24} />
          </button>
        )}

        {/* Scrollable Brand Logos */}
        <div className="flex overflow-hidden w-full justify-center items-center">
          {brands
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((brand, index) => (
              <img
                key={index}
                src={brand}
                alt={`Brand ${index + 1}`}
                className="h-32 w-32 object-contain mx-4 space-x-3"
              />
            ))}
        </div>

        {/* Next Button */}
        {currentIndex + itemsPerPage < brands.length && (
          <button
            onClick={nextSlide}
            className="p-2 text-gray-500 hover:text-gray-900"
          >
            <FaChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandSection;
