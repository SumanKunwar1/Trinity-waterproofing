import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  FaShoppingCart,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useUserData } from "../../hooks/useUserData";

const statusIcons = {
  completed: <FaCheckCircle className="text-green-500" />,
  pending: <FaRegClock className="text-yellow-500" />,
  cancelled: <FaTimesCircle className="text-red-500" />,
  cart: <FaShoppingCart className="text-blue-500" />,
};

export const PurchaseHistory: React.FC = () => {
  const { orders, isLoading, isError } = useUserData();
  const [filter, setFilter] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState<
    (typeof orders)[0] | null
  >(null);

  const filteredHistory = orders.filter(
    (order) =>
      order.products.some((product) =>
        product.name.toLowerCase().includes(filter.toLowerCase())
      ) || order.status.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading purchase history</div>;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <Label className="text-3xl font-bold text-gray-800">
          Purchase History
        </Label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search purchases..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusIcons).map(([status, icon]) => (
          <Card
            key={status}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="text-2xl">{icon}</div>
              <Label className="text-lg capitalize">{status}</Label>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {filteredHistory.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredHistory.map((order) => (
              <Card
                key={order._id}
                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {statusIcons[order.status as keyof typeof statusIcons]}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          {order.products
                            .map((product) => product.name)
                            .join(", ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${order.subtotal.toFixed(2)}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelectedPurchase(order)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Purchase Details</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <p>
                              <strong>Status:</strong>{" "}
                              {selectedPurchase?.status}
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(
                                selectedPurchase?.created_at || ""
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Amount:</strong> $
                              {selectedPurchase?.subtotal.toFixed(2)}
                            </p>
                            <p>
                              <strong>Items:</strong>
                            </p>
                            <ul className="list-disc pl-5">
                              {selectedPurchase?.products.map((product) => (
                                <li key={product._id}>{product.name}</li>
                              ))}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaRegClock className="text-5xl text-gray-400 mb-4" />
            <Label className="text-xl text-gray-600 mb-4">
              No purchases found
            </Label>
            <Button variant="outline" onClick={() => setFilter("")}>
              Clear Search
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
