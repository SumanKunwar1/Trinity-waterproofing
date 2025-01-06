import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../admin/store/store";
import { fetchFaqsAsync } from "../admin/store/faqSlice";
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
  const dispatch = useDispatch<AppDispatch>();
  const faqs = useSelector((state: RootState) => state.faqs.faqs);
  const isLoading = useSelector((state: RootState) => state.faqs.isLoading);
  const error = useSelector((state: RootState) => state.faqs.error);

  useEffect(() => {
    dispatch(fetchFaqsAsync());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
          <motion.div
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
              Frequently Asked Questions
            </motion.h1>
            {isLoading && <p>Loading FAQs...</p>}
            {error && <p>Error: {error}</p>}
            {!isLoading && !error && faqs.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <motion.div key={faq._id}>
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            )}
            {!isLoading && faqs.length === 0 && <p>No FAQs available.</p>}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
