import React, { useEffect, useState } from "react";
import { useUserData } from "../../hooks/useUserData";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FaStar } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { ReviewDialog } from "./ReviewDialog";
import { toast } from "react-toastify";

export const Reviews: React.FC = () => {
  const { isLoading, isError } = useUserData();
  const [reviews, setReviews] = useState([]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedReviewData, setSelectedReviewData] = useState<{
    rating: number;
    content: string;
    image?: string[];
  } | null>(null);
  const userId = JSON.parse(localStorage.getItem("userId") || "");

  // Fetch Reviews by User
  const fetchReviewsByUser = async (userId: string) => {
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

  // Handle Review Submission (Add or Update)
  const handleReviewSubmit = async (
    rating: number,
    content: string,
    images: File[]
  ) => {
    if (!selectedReviewId) return;

    try {
      const formData = new FormData();
      formData.append("rating", rating.toString());
      formData.append("content", content);
      images.forEach((image) => {
        formData.append("image", image);
      });

      const response = await fetch(
        `/api/review/${userId}/${selectedReviewId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");

      toast.success("Review updated successfully!");

      setIsReviewDialogOpen(false);
      // Refetch reviews after submission
      const userReviews = await fetchReviewsByUser(userId);
      setReviews(userReviews);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    }
  };

  // Handle Review Deletion
  const handleReviewDelete = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/review/${userId}/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete review");

      toast.success("Review deleted successfully!");

      // Refetch reviews after deletion
      const userReviews = await fetchReviewsByUser(userId);
      setReviews(userReviews);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    }
  };

  // Open the dialog and set the selected review's data
  const openReviewDialog = (
    reviewId: string,
    reviewData: { rating: number; content: string; image?: string[] }
  ) => {
    setSelectedReviewId(reviewId);
    setSelectedReviewData(reviewData);
    setIsReviewDialogOpen(true);
  };

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
                  <div className="flex space-x-2">
                    <Dialog
                      open={
                        isReviewDialogOpen &&
                        selectedReviewId === singleReview._id
                      }
                      onOpenChange={(open) => {
                        setIsReviewDialogOpen(open);
                        if (!open) setSelectedReviewId(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openReviewDialog(singleReview._id, {
                              rating: singleReview.rating,
                              content: singleReview.content,
                              image: singleReview.image,
                            })
                          }
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <ReviewDialog
                          onSubmit={handleReviewSubmit}
                          productName={review.name}
                          initialRating={selectedReviewData?.rating || 0}
                          initialContent={selectedReviewData?.content || ""}
                          initialImage={selectedReviewData?.image || []}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReviewDelete(singleReview._id)}
                    >
                      Delete
                    </Button>
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
