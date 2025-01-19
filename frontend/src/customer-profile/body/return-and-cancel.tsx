import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUndo,
  FaTimesCircle,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useUserData } from "../../hooks/useUserData";

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

const ReturnAndCancel = () => {
  const { orders, isError } = useUserData();
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const validStatuses = Object.keys(statusIcons);

  const filteredOrders = orders
    .filter((order: any) => validStatuses.includes(order.status))
    .filter(
      (order: any) =>
        (statusFilter === "" || order.status === statusFilter) &&
        (order._id.toLowerCase().includes(filter.toLowerCase()) ||
          order.status.toLowerCase().includes(filter.toLowerCase()) ||
          order.products.some((product: Product) =>
            product.productId?.name.toLowerCase().includes(filter.toLowerCase())
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <Label className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
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
            <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
              <div className="text-2xl">{icon}</div>
              <Label className="text-sm sm:text-base capitalize">{label}</Label>
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
            {filteredOrders.map((order: any) => (
              <Card
                key={order._id}
                className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <div className="text-2xl">
                        {statusIcons[order.status as keyof typeof statusIcons]
                          .icon || <FaSpinner className="text-gray-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-md">
                          Order #{order._id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-col sm:flex-row mt-2 space-y-2 sm:space-y-0 sm:space-x-2">
                          <span>
                            <strong>Product:</strong>
                          </span>
                          <ul className="pl-5">
                            {order?.products.map((product: Product) => (
                              <li key={product.productId?._id}>
                                {product.productId?.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0">
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
                                  <li key={product.productId?._id}>
                                    {product.productId?.name}
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

export default ReturnAndCancel;
