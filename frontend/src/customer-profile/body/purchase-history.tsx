import { Label } from "../../components/ui/label"; // Import Label from ShadCN
import { Button } from "../../components/ui/button"; // Import Button from ShadCN
import { Card } from "../../components/ui/card"; // Using ShadCN Card component for each item
import {
  FaShoppingCart,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"; // React Icons
import { motion } from "framer-motion"; // Import Framer Motion for animations

// Create a constant for Purchase History
const PurchaseHistoryItems = [
  { label: "Completed Purchase", icon: <FaCheckCircle fontSize={24} /> },
  { label: "Pending Purchase", icon: <FaRegClock fontSize={24} /> },
  { label: "Cancelled Purchase", icon: <FaTimesCircle fontSize={24} /> },
  { label: "Shopping Cart", icon: <FaShoppingCart fontSize={24} /> },
];

export const PurchaseHistory = () => {
  return (
    <motion.div
      className="ml-6 w-full md:w-[80%] border-2 border-black-200 py-2 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Label className="text-2xl font-semibold">Purchase History</Label>

      <motion.div
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {PurchaseHistoryItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="w-full p-4 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center space-x-2">
                <div>{item.icon}</div>
                <Label className="text-black-500">{item.label}</Label>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="border-b-2 border-black-300 mt-8"></div>

      {/* Placeholder for no purchase history */}
      <motion.div
        className="flex flex-col justify-center items-center h-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <FaRegClock fontSize={30} className="text-black-500" />
        <Label className="mt-2 text-lg">Nothing Found</Label>
        <Button
          variant="outline"
          className="mt-4 text-dark-blue border-dark-blue hover:bg-gray-800 hover:text-white transition"
        >
          Go Back
        </Button>
      </motion.div>
    </motion.div>
  );
};
