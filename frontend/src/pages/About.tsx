"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

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

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.5 } },
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <motion.div
            key="about"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              About WaterproofStore
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              WaterproofStore is your one-stop shop for all your waterproofing
              needs. We offer a wide range of high-quality waterproofing
              products for both residential and commercial applications.
            </p>
          </motion.div>
        );
      case "mission":
        return (
          <motion.div
            key="mission"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our mission is to provide innovative and effective waterproofing
              solutions to protect your property from water damage. With years
              of experience in the industry, we carefully curate our product
              selection to ensure we offer only the best and most reliable
              waterproofing products on the market.
            </p>
          </motion.div>
        );
      case "vision":
        return (
          <motion.div
            key="vision"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Our Vision
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We envision a world where every property is protected from water
              damage. Our commitment is to empower homeowners, contractors, and
              DIY enthusiasts with cutting-edge waterproofing solutions that
              ensure long-lasting protection and peace of mind.
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-tl-xl rounded-bl-xl"
              >
                <motion.img
                  src="https://trinitywaterproofing.com.np/wp-content/uploads/2024/08/waterproofing_2.jpeg"
                  alt="WaterproofStore"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-blue-600 bg-opacity-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="p-8 space-y-6">
                <div className="flex w-full bg-gray-200 dark:bg-gray-700 rounded-md p-1 mb-6">
                  {["about", "mission", "vision"].map((tab) => (
                    <Button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      variant={activeTab === tab ? "default" : "ghost"}
                      className="flex-1 capitalize"
                    >
                      {tab}
                    </Button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {renderTabContent()}
                </AnimatePresence>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default About;
