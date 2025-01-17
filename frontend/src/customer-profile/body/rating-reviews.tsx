import { useEffect, useState } from "react";
import { useUserData } from "../../hooks/useUserData";
import { Card, CardContent } from "../../components/ui/card";
import { FaStar } from "react-icons/fa";

// Define the types for the review objects
interface ReviewContent {
  _id: string;
  rating: number;
  content: string;
  image?: string | string[]; // Image can be a single string or an array of strings
}

interface Review {
  _id: string;
  name: string;
  review: ReviewContent[]; // Array of reviews for this product or service
}

export const Reviews: React.FC = () => {
  const { isLoading, isError } = useUserData();
  const userId = JSON.parse(localStorage.getItem("userId") || "");

  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch Reviews by User
  const fetchReviewsByUser = async (userId: string): Promise<Review[]> => {
    try {
      const response = await fetch(`/api/review/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return await response.json();
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      const userReviews = await fetchReviewsByUser(userId);
      setReviews(userReviews);
    };
    fetchReviews();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading reviews</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Your Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) =>
          review.review.map((singleReview) => (
            <Card
              key={`${review._id}-${singleReview._id}`}
              className="bg-white shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{review.name}</h3>
                    <div className="mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`${
                              star <= singleReview.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {singleReview.content}
                      </p>
                    </div>
                    {/* Show image(s) if available */}
                    {singleReview.image && (
                      <div className="mt-4 flex space-x-2">
                        {Array.isArray(singleReview.image)
                          ? singleReview.image.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`review-image-${index}`}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            ))
                          : singleReview.image && (
                              <img
                                src={singleReview.image}
                                alt="review-image"
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
