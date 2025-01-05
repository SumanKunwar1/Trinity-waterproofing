import React from "react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import Carousel from "../common/Carousel";
import { CAROUSEL_ITEMS, AUTO_PLAY_INTERVAL } from "../../constants/carousel"; // Import constants

const HeroSection: React.FC = () => {
  const carouselItems = CAROUSEL_ITEMS.map((item, index) => (
    <div
      key={index}
      className="relative h-[90vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${item.image})` }}
    >
      {/* Overlay content on top of the image */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{item.title}</h1>
          <p className="text-xl md:text-2xl mb-8">{item.description}</p>
          <Button to="/products" size="lg">
            Discover More
          </Button>
        </motion.div>
      </div>
    </div>
  ));

  return (
    <section>
      <Carousel items={carouselItems} autoPlay interval={AUTO_PLAY_INTERVAL} />
    </section>
  );
};

export default HeroSection;
