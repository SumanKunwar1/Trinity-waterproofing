import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import Carousel from "../common/Carousel";
import { toast } from "react-toastify"; // Assuming you're using this for toast notifications

const HeroSection: React.FC = () => {
  const [sliders, setSliders] = useState<any[]>([]); // Store the fetched sliders
  const [isLoading, setIsLoading] = useState<boolean>(true); // Handle loading state

  // Fetch the sliders data
  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/slider/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch sliders");

      const data = await response.json();
      console.log("sliderData", data);
      setSliders(data);
    } catch (error) {
      console.error("Error fetching sliders:", error);
      toast.info("No sliders available at the moment");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sliders when the component mounts
  useEffect(() => {
    fetchSliders();
  }, []);

  const carouselItems = sliders.map((item, index) => {
    // If mediaType is 'video', render the video element
    if (item.mediaType === "video") {
      return (
        <div key={index} className="relative h-[90vh]">
          {/* Video Background */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={item.media} type="video/mp4" />
            {/* You can add additional source types if needed */}
            Your browser does not support the video tag.
          </video>

          {/* Overlay content on top of the video */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {item.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8">{item.description}</p>
              <Button to="/products" size="lg">
                Discover More
              </Button>
            </motion.div>
          </div>
        </div>
      );
    }

    // If mediaType is 'image', render the image background
    return (
      <div
        key={index}
        className="relative h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${item.media})` }} // Assuming 'media' is the image URL
      >
        {/* Overlay content on top of the image */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {item.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8">{item.description}</p>
            <Button to="/products" size="lg">
              Discover More
            </Button>
          </motion.div>
        </div>
      </div>
    );
  });

  if (isLoading) {
    return <div>Loading...</div>; // Optional: You can replace this with a loading spinner
  }

  return (
    <section>
      <Carousel items={carouselItems} autoPlay interval={5000} />{" "}
      {/* Adjust interval as needed */}
    </section>
  );
};

export default HeroSection;
