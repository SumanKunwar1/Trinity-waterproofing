import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReturnPolicyPage: React.FC = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/return-policy");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch policies");
      }
      const data = await response.json();
      setPolicies(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch return policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
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
              Return Policy
            </motion.h1>
            {loading ? (
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Loading policies...
              </p>
            ) : policies.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {policies.map((policy: any) => (
                  <motion.div key={policy._id} variants={itemVariants}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{policy.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400">
                          {policy.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center">
                No policies found.
              </p>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnPolicyPage;
