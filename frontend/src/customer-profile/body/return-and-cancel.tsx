"use client";

import { useState } from "react";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  FaUndo,
  FaTimesCircle,
  FaCheckCircle,
  FaSpinner,
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

// Dummy data for returns and cancellations
const returnAndCancelData = [
  {
    id: 1,
    type: "return",
    status: "requested",
    date: "2023-05-22",
    item: "Wireless Headphones",
    reason: "Defective product",
  },
  {
    id: 2,
    type: "cancel",
    status: "approved",
    date: "2023-05-18",
    item: "Smart Watch",
    reason: "Changed mind",
  },
  {
    id: 3,
    type: "return",
    status: "approved",
    date: "2023-05-15",
    item: "Laptop Stand",
    reason: "Wrong size",
  },
  {
    id: 4,
    type: "cancel",
    status: "processing",
    date: "2023-05-20",
    item: "Bluetooth Speaker",
    reason: "Found better deal",
  },
];

const statusIcons = {
  requested: <FaUndo className="text-yellow-500" />,
  approved: <FaCheckCircle className="text-green-500" />,
  processing: <FaSpinner className="text-blue-500 animate-spin" />,
  cancelled: <FaTimesCircle className="text-red-500" />,
};

export const ReturnAndCancel = () => {
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    (typeof returnAndCancelData)[0] | null
  >(null);

  const filteredData = returnAndCancelData.filter(
    (item) =>
      item.item.toLowerCase().includes(filter.toLowerCase()) ||
      item.status.includes(filter.toLowerCase()) ||
      item.type.includes(filter.toLowerCase())
  );

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
              <Label className="text-lg capitalize">{status}</Label>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {filteredData.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredData.map((item) => (
              <Card
                key={item.id}
                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {statusIcons[item.status as keyof typeof statusIcons]}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{item.item}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-600 capitalize">
                        {item.type} - {item.status}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setSelectedItem(item)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {item.type === "return"
                                ? "Return"
                                : "Cancellation"}{" "}
                              Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <p>
                              <strong>Item:</strong> {selectedItem?.item}
                            </p>
                            <p>
                              <strong>Type:</strong> {selectedItem?.type}
                            </p>
                            <p>
                              <strong>Status:</strong> {selectedItem?.status}
                            </p>
                            <p>
                              <strong>Date:</strong> {selectedItem?.date}
                            </p>
                            <p>
                              <strong>Reason:</strong> {selectedItem?.reason}
                            </p>
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
