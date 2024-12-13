import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa"; // Using react-icons for the up arrow
import { motion } from "framer-motion"; // Importing framer-motion

const BackToTopButton: React.FC = () => {
  // State to track if the user has scrolled down
  const [showButton, setShowButton] = useState<boolean>(false);

  // Show button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        // Show button after scrolling 200px
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function using smooth scroll
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll behavior
    });
  };

  return (
    <>
      {showButton && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-secondary text-white p-3 rounded-full shadow-lg hover:bg-button border-s-amber-400 transition duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaArrowUp size={20} />
        </motion.button>
      )}
    </>
  );
};

export default BackToTopButton;
