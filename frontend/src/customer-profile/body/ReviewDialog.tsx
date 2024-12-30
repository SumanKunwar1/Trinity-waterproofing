import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { FaStar, FaUpload } from "react-icons/fa";

interface ReviewDialogProps {
  onSubmit: (rating: number, content: string, image?: File) => void;
  productName: string;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  onSubmit,
  productName,
}) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, content, image || undefined);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Write a Review for {productName}</DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-4">
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
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review here..."
          className="w-full h-32"
        />
        <div>
          <Label htmlFor="image-upload" className="block mb-2">
            Add an image (optional)
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <FaUpload className="mr-2" /> Upload Image
          </Button>
          {image && <p className="mt-2 text-sm text-gray-600">{image.name}</p>}
        </div>
      </div>
      <Button type="submit" className="mt-4 w-full">
        Submit Review
      </Button>
    </form>
  );
};
