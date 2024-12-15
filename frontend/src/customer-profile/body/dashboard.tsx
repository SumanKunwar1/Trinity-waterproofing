import { motion } from "framer-motion"; // Importing Framer Motion
import {
  FaArrowRight,
  FaShoppingBag,
  FaRegHeart,
  FaCube,
} from "react-icons/fa"; // Importing react-icons
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card"; // Assuming you have a Card component from shadcn

export const Dashboard = () => {
  return (
    <motion.div
      className="ml-6 w-full h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Expenditure Overview Section */}
      <motion.div
        className="bg-primary-500 p-4 h-[25%] rounded-lg shadow-lg"
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex space-x-4 items-center">
          <div className="bg-black-600 rounded-full p-2 w-[50px] h-[50px] text-center">
            <Label className="text-gray-800 text-xl">{"$"}</Label>
          </div>
          <div className="space-y-1">
            <Label className="text-gray-800 font-semibold">
              Total Expenditure
            </Label>
            <Label className="text-gray-800 text-2xl">Rs 0.00</Label>
          </div>
        </div>

        <motion.div
          className="py-3 px-2 flex items-center space-x-2 mt-4 cursor-pointer hover:bg-primary-400 rounded-md transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <Label className="text-gray-800">View order history</Label>
          <FaArrowRight fontSize={22} className="text-gray-800" />
        </motion.div>
      </motion.div>

      {/* Statistics and Shipping Section */}
      <motion.div
        className="py-8 px-4 flex flex-wrap gap-8 h-[70%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Statistics Section */}
        <div className="w-full sm:w-[30%] flex flex-col space-y-6">
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex space-x-6">
                <div className="p-2 rounded-full bg-primary-400 w-[50px] h-[50px] flex justify-center items-center text-white">
                  <FaShoppingBag size={25} />
                </div>
                <div className="space-y-1">
                  <Label className="text-black font-semibold">0</Label>
                  <Label className="text-gray-600">Products in cart</Label>
                </div>
              </div>
              <div className="border-b-2 border-black-300 w-[80%] mt-2"></div>
            </Card>
          </motion.div>

          {/* Products in watchlist */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex space-x-6">
                <div className="p-2 rounded-full bg-ternary-400 w-[50px] h-[50px] flex justify-center items-center text-white">
                  <FaRegHeart size={25} />
                </div>
                <div className="space-y-1">
                  <Label className="text-black font-semibold">0</Label>
                  <Label className="text-gray-600">Products in watchlist</Label>
                </div>
              </div>
              <div className="border-b-2 border-black-300 w-[80%] mt-2"></div>
            </Card>
          </motion.div>

          {/* Total products ordered */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex space-x-6">
                <div className="p-2 rounded-full bg-secondary-500 w-[50px] h-[50px] flex justify-center items-center text-white">
                  <FaCube size={25} />
                </div>
                <div className="space-y-1">
                  <Label className="text-black font-semibold">0</Label>
                  <Label className="text-gray-600">
                    Total products ordered
                  </Label>
                </div>
              </div>
              <div className="border-b-2 border-black-300 w-[80%] mt-2"></div>
            </Card>
          </motion.div>
        </div>

        {/* Shipping Address Section - Now to the right of stats */}
        <div className="md:w-[60%] sm:w-[70%] bg-white flex flex-col justify-center items-center space-y-4 p-6 rounded-lg shadow-lg">
          <Label className="text-black font-semibold">
            Default Shipping Address
          </Label>
          <Button className="bg-primary-500 text-gray-800 hover:bg-primary-600 transition duration-200">
            <span className="text-xl font-semibold">+</span> Add New Address
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
