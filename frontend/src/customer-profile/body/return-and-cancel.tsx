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
  reason?: string;
}

const statusIcons = {
  "return-requested": {
    icon: <FaUndo className="text-yellow-500" />,
    label: "Requested",
  },
  "return-approved": {
    icon: <FaCheckCircle className="text-green-500" />,
    label: "Approved",
  },
  "return-disapproved": {
    icon: <FaTimesCircle className="text-red-500" />,
    label: "Disapproved",
  },
  "order-cancelled": {
    icon: <FaTimesCircle className="text-red-500" />,
    label: "Cancelled",
  },
};

export const ReturnAndCancel = () => {
  const { orders, isLoading, isError } = useUserData();
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  // Filter orders based on multiple statuses and the search filter
  const validStatuses = Object.keys(statusIcons);

  // Filter orders by valid statuses, status filter, and the search term
  const filteredOrders = orders
    .filter((order) => validStatuses.includes(order.status))
    .filter(
      (order) =>
        (statusFilter === "" || order.status === statusFilter) &&
        (order._id.toLowerCase().includes(filter.toLowerCase()) ||
          order.status.toLowerCase().includes(filter.toLowerCase()) ||
          order.products.some((product: Product) =>
            product.productId.name.toLowerCase().includes(filter.toLowerCase())
          ))
    );

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
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusIcons).map(([status, { icon, label }]) => (
          <Card
            key={status}
            className={`bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
              statusFilter === status ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === status ? "" : status)
            }
          >
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="text-2xl">{icon}</div>
              <Label className="text-lg capitalize">{label}</Label>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setStatusFilter("");
          setFilter("");
        }}
        className="mt-4"
      >
        Clear Filters
      </Button>

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
                        {statusIcons[order.status as keyof typeof statusIcons]
                          .icon || <FaSpinner className="text-gray-500" />}
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
                        {
                          statusIcons[order.status as keyof typeof statusIcons]
                            .label
                        }
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
                              {
                                statusIcons[
                                  selectedItem?.status as keyof typeof statusIcons
                                ]?.label
                              }
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(
                                selectedItem?.createdAt || ""
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Products:</strong>
                            </p>
                            <ul className="list-disc pl-5">
                              {selectedItem?.products.map(
                                (product: Product) => (
                                  <li key={product.productId._id}>
                                    {product.productId.name}
                                  </li>
                                )
                              )}
                            </ul>
                            {selectedItem?.returnReason && (
                              <p>
                                <strong>Return Reason:</strong>{" "}
                                {selectedItem.returnReason}
                              </p>
                            )}
                            {selectedItem?.reason && (
                              <p>
                                <strong>Cancel Reason:</strong>{" "}
                                {selectedItem.reason}
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
