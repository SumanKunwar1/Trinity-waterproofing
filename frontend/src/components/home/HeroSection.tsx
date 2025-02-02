import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../common/Button";
import Carousel from "../common/Carousel";

interface SliderItem {
  mediaType: "video" | "image";
  media: string;
  title: string;
  description: string;
}

const HeroSection: React.FC = () => {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/slider/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch sliders");

      const data = await response.json();
      setSliders(data);
    } catch (error) {
      toast.info("No sliders available at the moment");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []); //Fixed: Added empty dependency array to useEffect

  const carouselItems = sliders.map((item, index) => (
    <div key={index} className="relative w-full h-full">
      {item.mediaType === "image" ? (
        <img
          src={item.media || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-contain md:object-cover"
        />
      ) : (
        <video
          className="w-full h-full object-contain md:object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={item.media} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/10 text-[#FEC615]"
      >
        <h1 className="text-xl md:text-2xl lg:text-4xl xl:text-6xl font-bold mb-2 md:mb-4">
          {item.title}
        </h1>
        <p className="text-xs md:text-sm lg:text-lg xl:text-2xl mb-4 md:mb-8">
          {item.description}
        </p>
        <Link to="/products" className="inline-block">
          <Button className="text-sm md:text-base cursor-pointer hover:bg-secondary transition-colors duration-300">
            Discover More
          </Button>
        </Link>
      </motion.div>
    </div>
  ));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px] md:h-[600px]">
        <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <section className="w-full flex justify-center">
      {sliders.length > 0 ? (
        <Carousel
          items={carouselItems}
          autoPlay
          interval={5000}
          className="w-full max-w-[1920px]"
        />
      ) : (
        <div className="flex justify-center items-center h-[300px] md:h-[600px] text-white text-xl md:text-2xl max-w-[1920px] w-full">
          No sliders available
        </div>
      )}
    </section>
  );
};

export default HeroSection;
