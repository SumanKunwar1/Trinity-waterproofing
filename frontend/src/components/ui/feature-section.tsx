import React from "react";
import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeatureSectionProps {
  features: Feature[];
  columns: number;
  className?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  features,
  columns,
  className = "",
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-${columns} gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          variants={itemVariants}
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureSection;
