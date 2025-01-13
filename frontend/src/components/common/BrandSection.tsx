import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FeaturedProductsHeader from "./FeaturedProductsHeader";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications
import { Brand } from "../../types/brand"; // Import the Brand type from the types folder

const BrandSection: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]); // Store brand objects
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5; // Number of logos to display at once

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brand", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add your auth token if needed
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBrands(data); // Assuming API returns an array of brands with name and image
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.error || "Failed to fetch brands";
          setError(errorMessage);
          toast.error(errorMessage); // Display error to user
        }
      } catch (error: any) {
        const errorMessage = error.message || "Error fetching brands";
        setError(errorMessage);
        toast.error(errorMessage); // Display error to user
      } finally {
        setLoading(false); // Set loading to false when the request finishes
      }
    };

    fetchBrands();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FeaturedProductsHeader title="Associated Brands" />
      <div className="flex items-center justify-center w-full my-8 relative">
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-lg"
          >
            <FaChevronLeft size={24} />
          </button>
        )}

        {/* Scrollable Brand Logos */}
        <div className="flex overflow-hidden w-full justify-center items-center space-x-6">
          {brands
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((brand, index) => (
              <div
                key={index}
                className="flex justify-center items-center h-40 w-40 md:h-48 md:w-48 relative transition-transform duration-300 transform hover:scale-110"
              >
                <img
                  src={brand.image}
                  alt={`Brand ${brand.name}`}
                  className="h-full w-full object-cover rounded-md mix-blend-color-burn"
                />
              </div>
            ))}
        </div>

        {/* Next Button */}
        {currentIndex + itemsPerPage < brands.length && (
          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-lg"
          >
            <FaChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandSection;
