import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <img
        src="/assets/logo.png"
        alt="Loading"
        className="loader-image h-36 w-36 mb-8"
      />
      <div className="balls-container flex space-x-4">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="ball w-4 h-4 bg-blue-500 rounded-full"
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.5,
              delay: 0.5 * (index + 1),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
