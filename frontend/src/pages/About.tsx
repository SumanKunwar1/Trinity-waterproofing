"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ImageContentSection from "../components/common/ImageContentSection";

interface AboutData {
  title: string;
  description: string;
  image: string;
}

interface CoreValue {
  title: string;
  description: string;
  image: string;
}

interface Tab {
  title: string;
  description: string;
  image: string;
}

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [about, setAbout] = useState<AboutData | null>(null);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [aboutRes, coresRes, tabsRes] = await Promise.all([
          fetch("/api/about"),
          fetch("/api/about/cores"),
          fetch("/api/about/tabs"),
        ]);

        if (!aboutRes.ok || !coresRes.ok || !tabsRes.ok) {
          const errorData = await Promise.all([
            aboutRes.json(),
            coresRes.json(),
            tabsRes.json(),
          ]);

          throw new Error(
            errorData
              .map((res) => res.error || "Failed to fetch data")
              .join(", ")
          );
        }

        const [aboutData, coresData, tabsData] = await Promise.all([
          aboutRes.json(),
          coresRes.json(),
          tabsRes.json(),
        ]);

        setAbout(aboutData);
        setCoreValues(coresData);
        setTabs(tabsData);
        setActiveTab(tabsData[0]?.title || "");
      } catch (err: any) {
        setError(
          err.message ||
            "An error occurred while fetching data. Please try again later."
        );
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

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
          <Card className="overflow-hidden mb-12 border-0 ">
            <CardContent className="p-0">
              {/* Tabs Container */}
              <div className="flex mx-auto space-x-4 bg-gray-200 dark:bg-gray-700 max-w-4xl rounded-md p-1 ">
                {tabs.map((tab) => (
                  <Button
                    key={tab.title}
                    onClick={() => setActiveTab(tab.title)}
                    variant={activeTab === tab.title ? "default" : "ghost"}
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
                    activeTab === tab.title && (
                      <motion.div
                        key={tab.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ImageContentSection
                          imagePosition="left"
                          imageUrl={tab.image}
                          content={
                            <div>
                              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                                {tab.title}
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {tab.description}
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
                  imageUrl={value.image}
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
                  imageUrl={about?.image || "/assets/waterproofing-1.png"}
                  content={
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {about?.description ||
                          "We stand out by delivering exceptional service and unwavering commitment to quality. Trust us to be your go-to experts, ensuring your property is protected and secure every step of the way."}
                      </p>
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
