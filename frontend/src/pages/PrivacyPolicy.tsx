import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const PrivacyPolicyPage: React.FC = () => {
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
              <p className="text-lg mb-6">
                At WaterproofStore, we are committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard
                your personal information.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
                Information We Collect
              </h2>
              <p className="text-lg mb-6">
                We collect information you provide directly to us, such as when
                you create an account, make a purchase, or contact our customer
                support.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-lg mb-6">
                We use your information to process orders, provide customer
                support, and improve our services. We may also use your
                information to send you promotional emails about our products
                and services.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
                Information Sharing and Disclosure
              </h2>
              <p className="text-lg mb-6">
                We do not sell or rent your personal information to third
                parties. We may share your information with service providers
                who assist us in operating our website and conducting our
                business.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
                Security
              </h2>
              <p className="text-lg mb-6">
                We implement a variety of security measures to maintain the
                safety of your personal information when you place an order or
                enter, submit, or access your personal information.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-lg mb-6">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page. We encourage you to review this Privacy Policy
                periodically for any updates or modifications.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
