import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0] || "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; // Number of thumbnails to show at once

  if (!images || images.length === 0) {
    return <p>No images available for this product.</p>;
  }

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < images.length) {
      setCurrentIndex(currentIndex + 1); // Move by one image at a time
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Move back by one image at a time
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Selected Image */}
      <div className="mb-4">
        <img
          src={selectedImage}
          alt="Selected"
          className="w-full h-64 object-cover rounded-md"
        />
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex items-center w-full">
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="p-2 text-gray-500 hover:text-gray-900"
          >
            <FaChevronLeft size={24} />
          </button>
        )}

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-hidden w-full justify-center">
          {images
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-24 h-24 object-cover rounded-md cursor-pointer ${
                  selectedImage === image ? "border-2 border-blue-600" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
        </div>

        {/* Next Button */}
        {currentIndex + itemsPerPage < images.length && (
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

export default ProductGallery;
