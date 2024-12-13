import { motion } from "framer-motion";
import { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa"; // Using react-icons for full and half stars
import Pagination from "./Pagination"; // Assuming Pagination component is in the same folder

interface Review {
  id: string;
  name: string;
  content: string;
  rating: number;
  date: string; // e.g., '2024-12-12'
}

interface TestimonialCardProps {
  reviews: Review[];
}

const TestimonialCard = ({ reviews }: TestimonialCardProps) => {
  const [sortOption, setSortOption] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 5;

  // Sorting logic
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortOption === "highest") {
      return b.rating - a.rating;
    } else if (sortOption === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  // Pagination Logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate the average rating
  const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalRatings / reviews.length;

  // Count the number of reviews for each rating (1-5)
  const ratingCounts = [0, 0, 0, 0, 0]; // Count for ratings 1 through 5
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1] += 1;
  });

  // Function to render full, half, or empty stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating); // Full stars based on the integer part
    const hasHalfStar = rating % 1 >= 0.5; // Check if the rating has a half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Empty stars to make total 5

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar
          key={`full-${i}`}
          className="text-yellow-500 text-sm"
          size={20}
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt
          key="half"
          className="text-yellow-500 text-sm"
          size={20}
        />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar
          key={`empty-${i}`}
          className="text-gray-400 text-sm"
          size={20}
        />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        <div className="space-y-6">
          {/* Display overall rating progress bars */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Overall Product Rating
            </h3>
            <div className="flex items-center space-x-6 mb-4"></div>
          </div>

          {/* Display progress bars for each rating (1-5 stars) */}
          <div className=" flex gap-4">
            {/* Average Rating & Stars */}
            <div className="flex items-center flex-col gap-4 ">
              <span className="flex text-3xl font-semibold text-brand align-middle text-center">
                {averageRating.toFixed(1)}
                <span className="text-xl mr-4 font-semibold text-brand text-center">
                  / 5
                </span>
              </span>
              <div className="flex">
                {renderStars(averageRating)}{" "}
                {/* Render stars based on average rating */}
              </div>
            </div>
            <div className="max-w-lg w-full space-y-4">
              {ratingCounts.map((count, index) => {
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    {/* Stars for the current rating */}
                    <div className="flex-shrink-0">
                      <div className="flex">{renderStars(5 - index)}</div>
                    </div>

                    {/* Progress bar for the current rating */}
                    <div className="flex-grow bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Number of reviews for the current rating */}
                    <div className="w-12 text-sm text-gray-600">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Display individual reviews */}
          {currentReviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg border-b p-6 mb-4"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-semibold text-base">{review.name}</h4>
                  <p className="text-sm text-gray-600">{review.date}</p>
                </div>
              </div>

              <div className="flex items-center mb-2">
                {renderStars(review.rating)}{" "}
                {/* Render stars based on individual review rating */}
              </div>

              <blockquote className="text-gray-600 italic text-sm">
                {review.content}
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(sortedReviews.length / reviewsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TestimonialCard;
