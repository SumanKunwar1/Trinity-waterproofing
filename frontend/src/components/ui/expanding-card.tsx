import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandingCardProps {
  title: string;
  children: React.ReactNode;
}

const ExpandingCard: React.FC<ExpandingCardProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <motion.header
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="p-4 border-t dark:border-gray-700">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandingCard;
