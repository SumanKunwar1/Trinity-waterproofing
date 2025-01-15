import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (images: File[]) => void;
  existingImages?: string[];
}

export function ImageUploadDialog({
  isOpen,
  onClose,
  onUpload,
  existingImages = [],
}: ImageUploadDialogProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingImages);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
    setPreviewUrls((prevUrls) => [
      ...prevUrls,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleUpload = () => {
    onUpload(selectedImages);
    onClose();
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="grid grid-cols-3 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-20 h-20">
                {/* Replacing next/image with standard img */}
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="object-cover w-full h-full rounded"
                />
                <Button
                  className="absolute top-0 right-0 p-1"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleUpload}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
