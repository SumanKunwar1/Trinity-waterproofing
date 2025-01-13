import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { getLatestPrivacyPolicy } from "../admin/utils/privacyPolicy";
import Loader from "../components/common/Loader";

const PrivacyPolicyPage: React.FC = () => {
  const [policyContent, setPolicyContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      setIsLoading(true);
      const policy = await getLatestPrivacyPolicy();
      setPolicyContent(policy.content);
    } catch (err) {
      console.error("Error fetching privacy policy:", err);
      setError("Failed to load privacy policy. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
          <motion.div
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8"
              variants={itemVariants}
            >
              Privacy Policy
            </motion.h1>
            <motion.div
              className="prose dark:prose-invert max-w-none"
              variants={itemVariants}
            >
              {isLoading ? (
                <Loader />
              ) : error ? (
                <p className="text-red-500 text-lg">{error}</p>
              ) : policyContent ? (
                <div dangerouslySetInnerHTML={{ __html: policyContent }} />
              ) : (
                <p className="text-lg mb-6">
                  No privacy policy has been added yet.
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
