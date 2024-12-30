import React, { useState } from "react";
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

export const Reviews: React.FC = () => {
  const { orders, isLoading, isError } = useUserData();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!selectedProductId) return;

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          productId: selectedProductId,
          rating,
          content,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit review");
      setIsReviewDialogOpen(false);
      // You might want to update the local state or refetch the data here
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading reviews</div>;

  const purchasedProducts = orders.flatMap((order) => order.products);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Your Reviews</h2>
      <div className="space-y-4">
        {purchasedProducts.map((product) => (
          <Card key={product._id} className="bg-white shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  {product.review ? (
                    <div className="mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`${
                              star <= product.review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {product.review.content}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No review yet</p>
                  )}
                </div>
                <Dialog
                  open={isReviewDialogOpen && selectedProductId === product._id}
                  onOpenChange={(open) => {
                    setIsReviewDialogOpen(open);
                    if (!open) setSelectedProductId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProductId(product._id)}
                    >
                      {product.review ? "Edit Review" : "Write Review"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ReviewDialog onSubmit={handleReviewSubmit} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
