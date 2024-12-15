import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card"; // ShadCN Card components

const Solutions: React.FC = () => {
  const solutions = [
    {
      title: "Residential Waterproofing",
      description:
        "Protect your home from water damage with our comprehensive residential waterproofing solutions.",
    },
    {
      title: "Commercial Building Waterproofing",
      description:
        "Ensure the longevity and structural integrity of your commercial buildings with our advanced waterproofing techniques.",
    },
    {
      title: "Industrial Waterproofing",
      description:
        "Protect your industrial facilities from water-related issues with our specialized industrial waterproofing solutions.",
    },
    {
      title: "Marine Waterproofing",
      description:
        "Safeguard your marine vessels and structures against water damage with our high-performance marine waterproofing products.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Our Waterproofing Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((solution, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{solution.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Solutions;
