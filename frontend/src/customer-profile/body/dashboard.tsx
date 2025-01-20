import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
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
import { Address } from "../../types/address";
import { useUserData } from "../../hooks/useUserData";
import { useWishlist } from "../../context/WishlistContext";

export const Dashboard: React.FC = () => {
  const { cart, orders, addresses, isLoading, isError } = useUserData();
  const {
    wishlist,
    isLoading: wishlistLoading,
    isError: wishlistError,
  } = useWishlist();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const defaultAddress = addresses.find((addr: Address) => addr.default);

  const totalExpenditure = orders.reduce(
    (total: number, order: any) => total + order.subtotal,
    0
  );
  const totalOrdered = orders.reduce(
    (total: number, order: any) => total + order.products.length,
    0
  );

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
      setIsAddressDialogOpen(false);
      toast.success("Address added successfully");
    } catch (error) {
      // console.error("Error adding address:", error);
      toast.error("Failed to add address");
    }
  };

  if (isLoading || wishlistLoading) return <div>Loading...</div>;
  if (isError || wishlistError) return <div>Error loading data</div>;

  return (
    <motion.div
      className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Expenditure Overview Section */}
      <motion.div
        className="bg-gradient-to-r from-primary to-button p-4 sm:p-6 rounded-xl shadow-lg text-white"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
          <div className="bg-white rounded-full p-3 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <span className="text-blue-600 text-xl sm:text-2xl font-bold">
              Rs
            </span>
          </div>
          <div className="mt-4 sm:mt-0">
            <h2 className="text-lg sm:text-xl font-semibold">
              Total Expenditure
            </h2>
            <p className="text-2xl sm:text-3xl font-bold mt-1">
              Rs {totalExpenditure.toFixed(2)}
            </p>
          </div>
        </div>
        <Link to="/customer/purchase-history">
          <motion.div
            className="mt-4 sm:mt-6 flex items-center space-x-2 cursor-pointer group"
            whileHover={{ x: 10 }}
          >
            <span className="text-sm sm:text-lg">View order history</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Statistics and Shipping Section */}
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Statistics Section */}
        <div className="space-y-4 sm:space-y-6">
          <StatCard
            icon={<FaShoppingBag size={20} />}
            value={cart.length}
            label="Products in cart"
            color="bg-green-500"
          />
          <StatCard
            icon={<FaRegHeart size={20} />}
            value={wishlist.length}
            label="Products in wishlist"
            color="bg-pink-500"
          />
          <StatCard
            icon={<FaCube size={20} />}
            value={totalOrdered}
            label="Total products ordered"
            color="bg-purple-500"
          />
        </div>

        {/* Shipping Address Section */}
        <Card className="md:col-span-2 bg-white shadow-lg">
          <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-4 h-full">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
              Default Shipping Address
            </h2>
            {defaultAddress ? (
              <div className="text-center">
                <p className="text-sm sm:text-base">{defaultAddress.street}</p>
                <p className="text-sm sm:text-base">{`${defaultAddress.city}, ${defaultAddress.province} ${defaultAddress.postalCode}`}</p>
                <p className="text-sm sm:text-base">{defaultAddress.country}</p>
                <Link to="/customer/address-book">
                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white transition duration-200">
                    Manage Addresses
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-base">
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

      {/* Recent Orders Section */}
      <Card className="bg-white shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4">
            Recent Orders
          </h2>
          {orders.slice(0, 5).map((order: any) => (
            <div
              key={order._id}
              className="border-b border-gray-200 py-2 sm:py-4 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="font-semibold text-sm sm:text-base">
                    Order #{order._id}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm sm:text-base">
                    Rs {order.subtotal.toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                    {order.status.toUpperCase().split("-").join(" ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <Link to="/customer/purchase-history">
            <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white transition duration-200">
              View All Orders
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Links to PurchaseHistory and Reviews */}
      <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
        <Link to="/customer/purchase-history">
          <Button
            variant="outline"
            className="w-full sm:w-auto border border-secondary hover:bg-hover hover:text-brand"
          >
            View Purchase History
          </Button>
        </Link>
        <Link to="/customer/reviews-ratings">
          <Button
            variant="outline"
            className="w-full sm:w-auto border border-secondary hover:bg-hover hover:text-brand"
          >
            Manage Reviews
          </Button>
        </Link>
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

export default Dashboard;
