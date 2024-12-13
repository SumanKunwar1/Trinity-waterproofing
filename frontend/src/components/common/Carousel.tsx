import React, { useState, useEffect, ReactNode } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { cn } from "../../lib/utils";

interface CarouselProps {
  items: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  interval = 4000, // 4 seconds by default
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % items.length); // Only moves forward
  };

  const handlePrev = () => {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Slide container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`, // Horizontal sliding
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {item}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 z-10"
      >
        <FaChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 z-10"
      >
        <FaChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-4 h-4 rounded-full transition-colors duration-300",
              currentIndex === index ? "bg-white" : "bg-white/50"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
