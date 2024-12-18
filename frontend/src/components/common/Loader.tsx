import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="loader-container">
      {/* Image at the top */}
      <img
        src="/assets/logo.png" // Replace with your image URL
        alt="Loading"
        className="loader-image h-36 w-36"
      />

      {/* Three balls below the image */}
      <div className="balls-container">
        <motion.div
          className="ball"
          animate={{ opacity: [0, 1, 0] }} // Fade in and out
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
            delay: 0.5,
          }}
        />
        <motion.div
          className="ball"
          animate={{ opacity: [0, 1, 0] }} // Fade in and out
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
            delay: 1.0,
          }}
        />
        <motion.div
          className="ball"
          animate={{ opacity: [0, 1, 0] }} // Fade in and out
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
            delay: 1.5,
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
