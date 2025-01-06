"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUndo,
  FaTimesCircle,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useUserData } from "../../hooks/useUserData";

// Define types for the order and product
interface Product {
  productId: { _id: string; name: string };
}

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  products: Product[];
  returnReason?: string;
  cancelReason?: string;
}

const statusIcons = {
  "return-requested": <FaUndo className="text-yellow-500" />,
  "return-approved": <FaCheckCircle className="text-green-500" />,
  "return-disapproved": <FaTimesCircle className="text-red-500" />,
  "order-cancelled": <FaTimesCircle className="text-red-500" />,
};

export const ReturnAndCancel = () => {
  const { orders, isLoading, isError } = useUserData();
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);

  // Filter orders based on multiple statuses and the search filter
  const validStatuses = [
    "return-requested",
    "return-approved",
    "return-disapproved",
  ];

  // Filter orders by valid statuses and the search term
  const filteredOrders = orders
    .filter((order) => validStatuses.includes(order.status))
    .filter(
      (order) =>
        order._id.toLowerCase().includes(filter.toLowerCase()) ||
        order.status.toLowerCase().includes(filter.toLowerCase()) ||
        order.products.some((product: Product) =>
          product.productId.name.toLowerCase().includes(filter.toLowerCase())
        )
    );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <Label className="text-3xl font-bold text-gray-800">
          Returns & Cancellations
        </Label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search returns & cancellations..."
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
              <Label className="text-lg capitalize">
                {status.replace("-", " ")}
              </Label>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {filteredOrders.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredOrders.map((order) => (
              <Card
                key={order._id}
                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {statusIcons[
                          order.status as keyof typeof statusIcons
                        ] || <FaSpinner className="text-gray-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          Order #{order._id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-600 capitalize">
                        {order.status.replace("-", " ")}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelectedItem(order)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <p>
                              <strong>Order ID:</strong> {selectedItem?._id}
                            </p>
                            <p>
                              <strong>Status:</strong>{" "}
                              {selectedItem?.status.replace("-", " ")}
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(
                                selectedItem?.createdAt
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Products:</strong>
                            </p>
                            <ul className="list-disc pl-5">
                              {selectedItem?.products.map((product: any) => (
                                <li key={product.productId._id}>
                                  {product.productId.name}
                                </li>
                              ))}
                            </ul>
                            {selectedItem?.returnReason && (
                              <p>
                                <strong>Return Reason:</strong>{" "}
                                {selectedItem.returnReason}
                              </p>
                            )}
                            {selectedItem?.cancelReason && (
                              <p>
                                <strong>Cancel Reason:</strong>{" "}
                                {selectedItem.cancelReason}
                              </p>
                            )}
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
            <FaTimesCircle className="text-5xl text-gray-400 mb-4" />
            <Label className="text-xl text-gray-600 mb-4">
              No returns or cancellations found
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
