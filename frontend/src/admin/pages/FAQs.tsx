import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const FAQs: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const faqs = [
    {
      question: "What types of waterproof products do you offer?",
      answer:
        "We offer a wide range of waterproof products including paints, sealants, membranes, and coatings suitable for various applications.",
    },
    {
      question: "How long does shipping usually take?",
      answer:
        "Shipping times vary depending on your location. Typically, orders are processed within 1-2 business days and shipping takes 3-5 business days for domestic orders.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we do offer international shipping to select countries. Please check our shipping policy for more details.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unopened products. Please refer to our return policy page for full details.",
    },
  ];

  return (
    <div>
      <div className="flex bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
