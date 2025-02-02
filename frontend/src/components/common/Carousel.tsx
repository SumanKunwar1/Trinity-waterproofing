import type React from "react";
import {
  useState,
  useEffect,
  type ReactNode,
  useRef,
  type TouchEvent,
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

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentPosition = e.clientX;
    const difference = dragStart - currentPosition;
    setDragOffset(difference);

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
    <div className={cn("relative w-full", className)}>
      <div
        className="relative overflow-hidden group touch-pan-y w-full"
        style={{
          aspectRatio: "16/9",
          maxHeight: "600px",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          ref={carouselRef}
          className={cn(
            "flex transition-transform duration-700 ease-in-out w-full h-full",
            isDragging ? "transition-none" : ""
          )}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 select-none h-full relative"
              style={{ touchAction: "pan-y pinch-zoom" }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Indicators Inside the Carousel */}
        <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center items-center gap-2 md:gap-3">
          <button
            onClick={handlePlayPause}
            className="p-1 md:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transform transition-transform hover:scale-110"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <FaPause className="h-2 w-2 md:h-3 md:w-3 lg:h-4 lg:w-4" />
            ) : (
              <FaPlay className="h-2 w-2 md:h-3 md:w-3 lg:h-4 lg:w-4" />
            )}
          </button>

          <div className="flex gap-1 md:gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "w-1.5 h-1.5 md:w-2 md:h-2 lg:h-3 lg:w-3 rounded-full transition-all duration-300 transform",
                  currentIndex === i
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/70"
                )}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute z-20 inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-between px-2 md:px-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePrev}
            className="p-1 md:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transform transition-transform hover:scale-110"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="h-3 w-3 md:h-4 md:w-4 lg:h-6 lg:w-6" />
          </button>

          <button
            onClick={handleNext}
            className="p-1 md:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transform transition-transform hover:scale-110"
            aria-label="Next slide"
          >
            <FaChevronRight className="h-3 w-3 md:h-4 md:w-4 lg:h-6 lg:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
