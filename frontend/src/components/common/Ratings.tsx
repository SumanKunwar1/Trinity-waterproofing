import React from "react";
import { RatingsProps } from "../../types/rating";

const Ratings: React.FC<RatingsProps> = ({ rating, ratingCount }) => {
  // Function to render full, half, and empty stars based on the rating value
  const renderStars = () => {
    const fullStars = Math.floor(rating); // Get the number of full stars
    const hasHalfStar = rating % 1 >= 0.5; // Check if there is a half star
    const emptyStars = 5 - Math.ceil(rating); // Calculate remaining empty stars

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <span
            key={`full-${index}`}
            className="h-[1.5rem] w-4 inline-block text-yellow-400"
          >
            ★
          </span>
        ))}
        {hasHalfStar && (
          <span className="h-[1.5rem] w-4 inline-block text-yellow-400">★</span>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <span
            key={`empty-${index}`}
            className="h-[1.5rem] w-4 inline-block text-gray-300"
          >
            ★
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="flex items-center">
      {renderStars()}
      <span className="ml-1 text-sm text-gray-500">({ratingCount})</span>
    </div>
  );
};

export default Ratings;
