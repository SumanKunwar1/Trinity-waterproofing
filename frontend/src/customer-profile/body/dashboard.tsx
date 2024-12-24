import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaArrowRight,
  FaShoppingBag,
  FaRegHeart,
  FaCube,
  FaPlus,
} from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { AddressForm } from "./address-form";

interface Address {
  _id: string;
  street: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  country: string;
  default: boolean;
}

export const Dashboard = () => {
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  useEffect(() => {
    fetchDefaultAddress();
  }, []);

  const fetchDefaultAddress = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(`/api/users/addressBook/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      const defaultAddr = data.addressBook.find(
        (addr: Address) => addr.default
      );
      setDefaultAddress(defaultAddr || null);
    } catch (error) {
      console.error("Error fetching default address:", error);
      toast.error("Failed to load default address");
    }
  };

  const handleAddressSubmit = async (
    address: Omit<Address, "_id" | "default">
  ) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(`/api/users/addressBook/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ ...address, default: true }),
      });
      if (!response.ok) throw new Error("Failed to add address");
      await fetchDefaultAddress();
      setIsAddressDialogOpen(false);
      toast.success("Address added successfully");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-gray-100 p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Expenditure Overview Section */}
      <motion.div
        className="bg-gradient-to-r from-primary to-button p-6 rounded-xl shadow-lg text-white"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <span className="text-blue-600 text-2xl font-bold">$</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Total Expenditure</h2>
            <p className="text-3xl font-bold mt-1">Rs 0.00</p>
          </div>
        </div>

        <Link to="/customer/purchase-history">
          <motion.div
            className="mt-6 flex items-center space-x-2 cursor-pointer group"
            whileHover={{ x: 10 }}
          >
            <span className="text-lg">View order history</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Statistics and Shipping Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Statistics Section */}
        <div className="md:col-span-1 space-y-6">
          <StatCard
            icon={<FaShoppingBag size={25} />}
            value={0}
            label="Products in cart"
            color="bg-green-500"
          />
          <StatCard
            icon={<FaRegHeart size={25} />}
            value={0}
            label="Products in watchlist"
            color="bg-pink-500"
          />
          <StatCard
            icon={<FaCube size={25} />}
            value={0}
            label="Total products ordered"
            color="bg-purple-500"
          />
        </div>

        {/* Shipping Address Section */}
        <Card className="md:col-span-2 bg-white shadow-lg">
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 h-full">
            <h2 className="text-2xl font-semibold text-gray-800">
              Default Shipping Address
            </h2>
            {defaultAddress ? (
              <div className="text-center">
                <p>{defaultAddress.street}</p>
                <p>{`${defaultAddress.city}, ${defaultAddress.province} ${defaultAddress.postalCode}`}</p>
                <p>{defaultAddress.country}</p>
                <Link to="/customer/address-book">
                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white transition duration-200">
                    Manage Addresses
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600">
                  You haven't set a default shipping address yet.
                </p>
                <Dialog
                  open={isAddressDialogOpen}
                  onOpenChange={setIsAddressDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white transition duration-200">
                      <FaPlus className="mr-2" /> Add New Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <AddressForm onSubmit={handleAddressSubmit} />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`${color} rounded-full p-3 text-white`}>{icon}</div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-gray-600">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
