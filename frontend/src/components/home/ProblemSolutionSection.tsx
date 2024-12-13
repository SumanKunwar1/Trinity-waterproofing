import React from "react";
import { motion } from "framer-motion";
import { FaTint, FaShieldAlt, FaSun, FaWind } from "react-icons/fa";

const problems = [
  {
    id: 1,
    icon: FaTint,
    title: "Basement Flooding",
    solution: "Waterproof Sealants and Drainage Systems",
  },
  {
    id: 2,
    icon: FaShieldAlt,
    title: "Roof Leaks",
    solution: "High-Performance Roof Coatings",
  },
  {
    id: 3,
    icon: FaSun,
    title: "Wall Moisture",
    solution: "Moisture Barriers and Waterproof Paints",
  },
  {
    id: 4,
    icon: FaWind,
    title: "External Weather Exposure",
    solution: "All-Weather Protection Systems",
  },
];

const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            Common Problems, Lasting Solutions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Identify your waterproofing challenges and discover our proven
            solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 hover:bg-hover transition-all duration-300 rounded-lg p-6"
            >
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.solution}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
