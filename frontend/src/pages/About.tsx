"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ImageContentSection from "../components/common/ImageContentSection";

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    {
      key: "semitrone.jpg",
      title: "About Trinity",
      content: `With decades of consistent supply of construction chemicals, Trinity has established itself as a leader in the industry. Our commitment to quality and innovation has made us the go-to choice for construction professionals across the nation.`,
    },
    {
      key: "success.png",
      title: "Our Mission",
      content: `Our mission is to supply high quality construction chemicals and provide expert solutions that contribute to the durability and longevity of infrastructure. We strive to be at the forefront of technological advancements in our field, ensuring our clients always have access to the best products and services.`,
    },
    {
      key: "waterproofing-1.png",
      title: "Our Vision",
      content: `"Healthy and safe infrastructure in the nation." We envision a future where every building and structure in our country is protected by the most advanced and effective waterproofing and construction chemical solutions, contributing to a safer and more sustainable built environment.`,
    },
  ];

  const coreValues = [
    {
      title: "Valuable Customers",
      description:
        "We consistently deliver exceptional quality products and services, prioritizing our customers' needs and satisfaction above all else. Our customer-centric approach ensures that we build long-lasting relationships based on trust and reliability.",
      imageUrl: "/assets/dr-fixit.png",
    },
    {
      title: "Dedicated Team",
      description:
        "Our dedicated team is empowered to excel in their roles, bringing innovation and expertise to every project. We foster a culture of continuous learning and improvement, enabling our staff to stay at the cutting edge of industry developments.",
      imageUrl: "/assets/fail.png",
    },
    {
      title: "The Nation",
      description:
        "We are committed to contributing to the nation's growth by providing solutions that enhance the quality and longevity of its infrastructure. Our work directly impacts the safety and durability of buildings across the country, supporting national development.",
      imageUrl: "/assets/fevicol.png",
    },
  ];

  const reasons = [
    "Top industry associations",
    "State-of-the-art tools",
    "Premium quality materials",
    "Exceptional customer care",
    "100% job satisfaction",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Card className="overflow-hidden mb-12">
            <CardContent className="p-0">
              {/* Tabs Container */}
              <div className="flex space-x-4 bg-gray-200 dark:bg-gray-700 rounded-md p-1 mb-6 w-full max-w-4xl mx-auto">
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    variant={activeTab === tab.key ? "default" : "ghost"}
                    className="flex-1 capitalize"
                  >
                    {tab.title}
                  </Button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {tabs.map(
                  (tab) =>
                    activeTab === tab.key && (
                      <motion.div
                        key={tab.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ImageContentSection
                          imagePosition="left"
                          imageUrl={`/assets/${tab.key}`}
                          content={
                            <div>
                              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                                {tab.title}
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {tab.content}
                              </p>
                            </div>
                          }
                        />
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <motion.section
            id="values"
            className="py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Core Values</h2>
            <div className="space-y-12">
              {coreValues.map((value, index) => (
                <ImageContentSection
                  key={index}
                  imagePosition={index % 2 === 0 ? "left" : "right"}
                  imageUrl={value.imageUrl}
                  content={
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {value.description}
                      </p>
                    </div>
                  }
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            className="py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Choose Us?
            </h2>
            <Card>
              <CardContent className="p-6">
                <ImageContentSection
                  imagePosition="right"
                  imageUrl="/assets/waterproofing-2.jpg"
                  content={
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        We stand out by delivering exceptional service and
                        unwavering commitment to quality. Trust us to be your
                        go-to experts, ensuring your property is protected and
                        secure every step of the way.
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                        {reasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  }
                />
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
