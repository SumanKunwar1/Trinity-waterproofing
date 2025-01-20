import React, { useEffect, useState } from "react";
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
      // console.error("Error fetching sliders:", error);
      toast.info("No sliders available at the moment");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const carouselItems = sliders.map((item, index) => {
    const content = (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{item.title}</h1>
        <p className="text-xl md:text-2xl mb-8">{item.description}</p>
        <Link
          to="/products"
          className="inline-block"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Button
            size="lg"
            className="cursor-pointer hover:bg-secondary transition-colors duration-300"
          >
            Discover More
          </Button>
        </Link>
      </motion.div>
    );

    if (item.mediaType === "video") {
      return (
        <div key={index} className="relative h-[60vh] md:h-[90vh]">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={item.media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-white">
            {content}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="relative h-[70vh] md:h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${item.media})` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-white">
          {content}
        </div>
      </div>
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <section className="relative">
      <Carousel items={carouselItems} autoPlay interval={5000} />
    </section>
  );
};

export default HeroSection;
