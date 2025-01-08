import React, {
  useState,
  useEffect,
  ReactNode,
  useRef,
  TouchEvent,
} from "react";
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from "react-icons/fa";
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
  interval = 4000,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Required minimum touch/drag distance for a swipe (in pixels)
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval]);

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((current) => (current - 1 + items.length) % items.length);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Touch handlers
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentPosition = e.clientX;
    const difference = dragStart - currentPosition;
    setDragOffset(difference);

    // Add a transform to the carousel while dragging
    if (carouselRef.current) {
      const translateValue =
        -(currentIndex * 100) -
        (difference / carouselRef.current.offsetWidth) * 100;
      carouselRef.current.style.transform = `translateX(${translateValue}%)`;
    }
  };

  const onMouseUp = () => {
    if (!isDragging) return;

    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    } else {
      // Reset position if swipe wasn't long enough
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(-${
          currentIndex * 100
        }%)`;
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div
      className={cn("relative overflow-hidden group touch-pan-y", className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Slide container */}
      <div
        ref={carouselRef}
        className={cn(
          "flex transition-transform duration-700 ease-in-out h-full",
          isDragging ? "transition-none" : ""
        )}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 select-none"
            style={{ touchAction: "pan-y pinch-zoom" }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Controls overlay - appears on hover */}
      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transform transition-transform hover:scale-110"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transform transition-transform hover:scale-110"
          aria-label="Next slide"
        >
          <FaChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transform transition-transform hover:scale-110"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <FaPause className="h-4 w-4" />
          ) : (
            <FaPlay className="h-4 w-4" />
          )}
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 transform",
                currentIndex === index
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              )}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
