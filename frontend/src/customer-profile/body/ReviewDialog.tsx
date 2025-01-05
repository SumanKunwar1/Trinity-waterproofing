import React, { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { FaStar, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

interface ReviewDialogProps {
  onSubmit: (rating: number, content: string, images?: File[]) => void;
  productName: string;
  initialRating?: number;
  initialContent?: string;
  initialImages?: File[] | null;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  onSubmit,
  productName,
  initialRating = 0,
  initialContent = "",
  initialImages = null,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [content, setContent] = useState<string>(initialContent);
  const [images, setImages] = useState<File[] | null>(initialImages);

  useEffect(() => {
    setRating(initialRating);
    setContent(initialContent);
    setImages(initialImages || []);
  }, [initialRating, initialContent, initialImages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    if (!content) {
      toast.error("Content cannot be empty.");
      return;
    }

    onSubmit(rating, content, images || undefined);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      setImages(selectedImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages?.filter((_, i) => i !== index) || []);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Write a Review for {productName}</DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        {/* Rating Stars */}
        <div className="flex items-center">
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

        {/* Review Content */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review here..."
          className="w-full h-32"
        />

        {/* Image Upload */}
        <div>
          <Label htmlFor="image-upload" className="block mb-2">
            Add images (optional)
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <FaUpload className="mr-2" /> Upload Images
          </Button>

          {/* Show selected images */}
          {images && images.length > 0 && (
            <div className="mt-4 space-x-4">
              {images.map((img, index) => (
                <div key={index} className="relative inline-block">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`review-image-${index}`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-red-500"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="mt-4 w-full">
        Submit Review
      </Button>
    </form>
  );
};
