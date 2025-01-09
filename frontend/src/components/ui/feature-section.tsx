import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./card";

interface Feature {
  _id: string;
  title: string;
  description: string;
  image: string; // Renamed from imageUrl to image as per the provided structure
}

interface FeatureSectionProps {
  features: Feature[]; // Pass dynamic feature data
  className?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  features,
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
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature) => (
        <motion.div key={feature._id} variants={itemVariants}>
          <Card className="h-full">
            <CardContent className="p-4 flex items-center space-x-4">
              {/* Image on the left side */}
              <img
                src={`${feature.image}`} // Assuming the images are stored in the assets folder
                alt={feature.title}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
              {/* Content on the right side */}
              <div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureSection;
