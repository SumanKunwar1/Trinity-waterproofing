import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const FAQPage: React.FC = () => {
  const faqItems = [
    {
      question: "What types of waterproofing products do you offer?",
      answer:
        "We offer a wide range of waterproofing products including sealants, membranes, coatings, and drainage solutions for both residential and commercial applications.",
    },
    {
      question:
        "How do I choose the right waterproofing product for my project?",
      answer:
        "The best product depends on your specific needs. We recommend contacting our customer support team for personalized advice based on your project requirements.",
    },
    {
      question: "Do you offer installation services?",
      answer:
        "We don't offer direct installation services, but we can recommend certified professionals in your area who are experienced with our products.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unopened products. Please check our Returns page for more detailed information.",
    },
    {
      question: "How long do your waterproofing products typically last?",
      answer:
        "The lifespan of our products varies depending on the specific product and application. Many of our solutions are designed to last for several years with proper application and maintenance.",
    },
  ];

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
              Frequently Asked Questions
            </motion.h1>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
