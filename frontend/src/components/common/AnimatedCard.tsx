import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
}

const AnimatedCard: FC<AnimatedCardProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
