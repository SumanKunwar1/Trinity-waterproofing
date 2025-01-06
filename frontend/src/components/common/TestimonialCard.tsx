import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaStar, FaStarHalfAlt, FaFilter } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import Pagination from "./Pagination";
import { Review } from "../../types/review";

interface TestimonialCardProps {
  reviews: Review[];
}

const TestimonialCard = ({ reviews }: TestimonialCardProps) => {
  const [sortOption, setSortOption] = useState<string>("latest");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 5;

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] =
    useState<boolean>(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target as Node) &&
        ratingRef.current &&
        !ratingRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
        setIsRatingDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === "recent") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortOption === "highest") {
      return b.rating - a.rating;
    } else if (sortOption === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  const filteredReviews = ratingFilter
    ? sortedReviews.filter((review) => review.rating === ratingFilter)
    : sortedReviews;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalRatings / reviews.length;

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1] += 1;
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

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
        <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
          Customer Reviews
        </h2>

        <div className="space-y-6">
          <div className="mb-6">
            <div className="flex items-center space-x-6 mb-4"></div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center flex-col gap-4">
              <span className="flex text-3xl font-semibold text-brand align-middle text-center">
                {averageRating.toFixed(1)}
                <span className="text-xl mr-4 font-semibold text-brand text-center">
                  / 5
                </span>
              </span>
              <div className="flex">{renderStars(averageRating)}</div>
            </div>
            <div className="max-w-lg w-full space-y-4">
              {ratingCounts.map((count, index) => {
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex">{renderStars(5 - index)}</div>
                    </div>

                    <div className="flex-grow bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="w-12 text-sm text-gray-600">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center p-3 border-t border-b gap-4 space-y-3 my-4 justify-between">
            <div className="flex ">
              <span className="text-brand font-semibold text-xl">
                Product Reviews
              </span>
            </div>
            <div className="flex space-y-0 mt-0 gap-2">
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center text-gray-700 p-2 hover:bg-gray-200 rounded-md"
                >
                  <FaFilter className="mr-2" />
                  Sort: {sortOption === "latest" ? "Relevance" : sortOption}
                  <IoChevronDownOutline className="ml-2" />
                </button>
                {isSortDropdownOpen && (
                  <div className="absolute right-0 w-48 bg-white border border-gray-300 shadow-lg mt-2 rounded-md z-10">
                    <div
                      onClick={() => {
                        setSortOption("latest");
                        setIsSortDropdownOpen(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      Relevance
                    </div>
                    <div
                      onClick={() => {
                        setSortOption("recent");
                        setIsSortDropdownOpen(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      Recent
                    </div>
                    <div
                      onClick={() => {
                        setSortOption("highest");
                        setIsSortDropdownOpen(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      Highest Rating
                    </div>
                    <div
                      onClick={() => {
                        setSortOption("lowest");
                        setIsSortDropdownOpen(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      Lowest Rating
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={ratingRef}>
                <button
                  onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  className="flex items-center text-gray-700  p-2 hover:bg-gray-200 rounded-md"
                >
                  Filter: {ratingFilter ? `${ratingFilter} Stars` : "All Stars"}
                  <IoChevronDownOutline className="ml-2" />
                </button>
                {isRatingDropdownOpen && (
                  <div className="absolute right-0 w-48 bg-white border border-gray-300 shadow-lg mt-2 rounded-md z-10">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div
                        key={rating}
                        onClick={() => {
                          setRatingFilter(rating);
                          setIsRatingDropdownOpen(false);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {rating} Stars
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {currentReviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ y: -5 }}
              className="bg-white flex flex-col space-y-3 rounded-lg border-b p-6 mb-4"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full">
                  <div className="avatar-inner w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-secondary flex items-center justify-center">
                    {review.fullName ? (
                      <span className="text-xl text-white">
                        {review.fullName
                          .split(" ") // Split the name by spaces
                          .map((word) => word.charAt(0).toUpperCase()) // Take the first character of each word and capitalize it
                          .join("")}{" "}
                        {/* Join the letters together */}
                      </span>
                    ) : (
                      <span className="text-xl text-white">U</span>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex space-x-4">
                  <h4 className="font-semibold text-base">{review.name}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(review.createdAt).toDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-2">
                {renderStars(review.rating)}
              </div>

              <blockquote className="text-gray-600 italic text-sm">
                {review.content}
              </blockquote>
            </motion.div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredReviews.length / reviewsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TestimonialCard;
