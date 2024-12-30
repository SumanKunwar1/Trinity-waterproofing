import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { FaStar } from "react-icons/fa";

interface ReviewDialogProps {
  onSubmit: (rating: number, content: string) => void;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, content);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Write a Review</DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review here..."
          className="w-full h-32"
        />
      </div>
      <Button type="submit" className="mt-4 w-full">
        Submit Review
      </Button>
    </form>
  );
};
