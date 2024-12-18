import React, { useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState("about");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-4">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800"
            >
              About WaterproofStore
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 leading-relaxed"
            >
              WaterproofStore is your one-stop shop for all your waterproofing
              needs. We offer a wide range of high-quality waterproofing
              products for both residential and commercial applications.
            </motion.p>
          </div>
        );
      case "mission":
        return (
          <div className="space-y-4">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800"
            >
              Our Mission
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 leading-relaxed"
            >
              Our mission is to provide innovative and effective waterproofing
              solutions to protect your property from water damage. With years
              of experience in the industry, we carefully curate our product
              selection to ensure we offer only the best and most reliable
              waterproofing products on the market.
            </motion.p>
          </div>
        );
      case "vision":
        return (
          <div className="space-y-4">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800"
            >
              Our Vision
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 leading-relaxed"
            >
              We envision a world where every property is protected from water
              damage. Our commitment is to empower homeowners, contractors, and
              DIY enthusiasts with cutting-edge waterproofing solutions that
              ensure long-lasting protection and peace of mind.
            </motion.p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="min-h-screen bg-gray-50 py-16 "
        >
          <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-4 ">
            {/* Image Section */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-xl "
            >
              <img
                src="https://trinitywaterproofing.com.np/wp-content/uploads/2024/08/waterproofing_2.jpeg"
                alt="WaterproofStore"
                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
              />
            </motion.div>

            {/* Content Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Custom Tabs Navigation */}
              <div className="flex w-full bg-gray-200 rounded-md p-1 mb-6">
                {["about", "mission", "vision"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                  flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300
                  capitalize
                  ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-300"
                  }
                `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
