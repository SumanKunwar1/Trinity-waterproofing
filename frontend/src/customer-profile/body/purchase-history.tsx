import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  FaCheckCircle,
  FaRegClock,
  FaTruck,
  FaExclamationCircle,
  FaSearch,
  FaEllipsisV,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useUserData } from "../../hooks/useUserData";
import { ReviewDialog } from "./ReviewDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

interface Product {
  productId: {
    _id: string;
    name: string;
  };
}

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  subtotal: number;
  products: Product[];
}

const statusIcons = {
  "order-delivered": <FaCheckCircle className="text-green-500" />,
  "order-cancelled": <FaExclamationCircle className="text-red-500" />,
  "order-shipped": <FaTruck className="text-blue-500" />,
  "order-requested": <FaRegClock className="text-yellow-500" />,
  "order-confirmed": <FaRegClock className="text-blue-500" />,
};

const cancelSchema = yup.object().shape({
  reason: yup.string().required("Reason is required"),
});

const returnSchema = yup.object().shape({
  reason: yup.string().required("Reason is required"),
});

export const PurchaseHistory: React.FC = () => {
  const { orders, isLoading, isError } = useUserData();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState<Order | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState<Product | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register: registerCancel,
    handleSubmit: handleSubmitCancel,
    formState: { errors: errorsCancel },
  } = useForm({
    resolver: yupResolver(cancelSchema),
  });

  const {
    register: registerReturn,
    handleSubmit: handleSubmitReturn,
    formState: { errors: errorsReturn },
  } = useForm({
    resolver: yupResolver(returnSchema),
  });

  console.log("Orders:", orders);
  const filteredHistory = orders
    .filter(
      (order: any) =>
        (statusFilter === "" || order.status === statusFilter) &&
        (order.products.some((product: any) =>
          product?.productId?.name?.toLowerCase().includes(filter.toLowerCase())
        ) ||
          order.status?.toLowerCase().includes(filter.toLowerCase()))
    )
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const handleReviewSubmit = async (
    rating: number,
    content: string,
    images: File[]
  ) => {
    if (!selectedProductForReview || !selectedPurchase) return;

    try {
      const formData = new FormData();
      formData.append("productId", selectedProductForReview.productId._id);
      formData.append("rating", rating.toString());
      formData.append("content", content);
      images.forEach((image) => {
        formData.append("image", image);
      });

      const response = await fetch(`/api/review/${selectedPurchase._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit review");
      setIsReviewDialogOpen(false);
      navigate("/customer/reviews-ratings");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleReturnRequest = async (data: { reason: string }) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(
        `/api/order/${userId}/return-request/${selectedPurchase?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ reason: data.reason }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit return request");
      toast.success("Return request submitted successfully");
      setIsReturnDialogOpen(false);
    } catch (error) {
      console.error("Error submitting return request:", error);
      toast.error("Failed to submit return request");
    }
  };

  const handleCancelRequest = async (data: { reason: string }) => {
    if (!selectedPurchase) return;

    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(
        `/api/order/${userId}/cancel/${selectedPurchase._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ reason: data.reason }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to request cancellation");
      }
      toast.success("Cancel request submitted successfully");
      setIsCancelDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
            className={`bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
              statusFilter === status ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() =>
              setStatusFilter(statusFilter === status ? "" : status)
            }
          >
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="text-2xl">{icon}</div>
              <Label className="text-lg capitalize">
                {status.split("-")[1]}
              </Label>
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
        {filteredHistory.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredHistory.map((order: any) => (
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
                        ] || <FaRegClock className="text-gray-500" />}
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
                    <div className="text-right flex items-center">
                      <p className="font-bold text-lg mr-4">
                        Rs {order.subtotal.toFixed(2)}
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <FaEllipsisV />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={() => setSelectedPurchase(order)}
                          >
                            View Details
                          </DropdownMenuItem>
                          {order.status === "order-delivered" && (
                            <DropdownMenuItem
                              onSelect={() => {
                                setSelectedPurchase(order);
                                setIsReturnDialogOpen(true);
                              }}
                            >
                              Return
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedPurchase(order);
                              setIsCancelDialogOpen(true);
                            }}
                          >
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="bg-white rounded-md shadow-lg p-6">
          <ReviewDialog
            onSubmit={handleReviewSubmit}
            productName={selectedProductForReview?.productId.name}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedPurchase !== null}
        onOpenChange={() => setSelectedPurchase(null)}
      >
        <DialogContent className="bg-white rounded-md shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Purchase Details
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>
              <strong>Status:</strong>{" "}
              {selectedPurchase?.status.split("-")[1].toUpperCase()}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedPurchase?.createdAt || "").toLocaleDateString()}
            </p>
            <p>
              <strong>Amount:</strong> Rs{" "}
              {selectedPurchase?.subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Items:</strong>
            </p>
            <ul className="list-disc pl-5">
              {selectedPurchase?.products.map((product) => (
                <li
                  key={product.productId._id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {product.productId.name || "Product Name Unavailable"}
                  </span>

                  {selectedPurchase.status === "order-delivered" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProductForReview(product);
                        setIsReviewDialogOpen(true);
                      }}
                    >
                      Review
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent className="bg-white rounded-md shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Return Order
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReturn(handleReturnRequest)}>
            <div className="mt-4">
              <Label htmlFor="return-reason">Reason for return</Label>
              <Input
                id="return-reason"
                {...registerReturn("reason")}
                className="mt-1"
              />
              {errorsReturn.reason && (
                <p className="text-red-500 text-sm mt-1">
                  {errorsReturn.reason.message}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="bg-white rounded-md shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Cancel Order
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCancel(handleCancelRequest)}>
            <div className="mt-4">
              <Label htmlFor="cancel-reason">Reason for cancellation</Label>
              <Input
                id="cancel-reason"
                {...registerCancel("reason")}
                className="mt-1"
              />
              {errorsCancel.reason && (
                <p className="text-red-500 text-sm mt-1">
                  {errorsCancel.reason.message}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PurchaseHistory;
