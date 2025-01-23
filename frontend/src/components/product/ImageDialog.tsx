import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { X } from "lucide-react";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  isOpen,
  onClose,
  imageSrc,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setScale((prevScale) => {
      const newScale = Math.max(1, Math.min(5, prevScale + e.deltaY * -0.01));
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 }); // Reset position when zoomed out completely
      }
      return newScale;
    });
  }, []);

  useEffect(() => {
    const element = document.getElementById("zoomable-image");
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (element) {
        element.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    setScale((prevScale) => (prevScale === 1 ? 2 : 1)); // Toggle between 1x and 2x zoom
    setPosition({ x: 0, y: 0 }); // Reset position when zooming
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-auto">
        <div className="relative w-screen h-screen">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
          >
            <X size={24} />
          </button>
          <div
            id="zoomable-image"
            className="w-full h-screen overflow-hidden cursor-zoom-in"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          >
            <img
              src={imageSrc || "/placeholder.svg"}
              alt="Zoomed product"
              className="w-full h-screen object-contain transition-transform"
              style={{
                transform: `scale(${scale}) translate(${
                  position.x / scale
                }px, ${position.y / scale}px)`,
              }}
              draggable="false"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
