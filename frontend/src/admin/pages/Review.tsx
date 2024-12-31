"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye, FaTrash } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import Table from "../components/ui/table";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AppDispatch, RootState } from "../store/store";
import { fetchReviews, deleteReview, Review } from "../store/reviewsSlice";

const Reviews: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { reviews, status, error } = useSelector(
    (state: RootState) => state.reviews
  );

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };
  console.log("Seclected review:", selectedReview);

  const handleDeleteReview = async () => {
    if (selectedReview) {
      try {
        await dispatch(deleteReview(selectedReview.id)).unwrap();
        toast.success("Review deleted successfully");
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  const columns = [
    { header: "Product", accessor: "productName" },
    { header: "Customer", accessor: "customerName" },
    { header: "Rating", accessor: "rating" },
    { header: "Date", accessor: "createdAt" },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: Review) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewReview(row)}
          >
            <FaEye className="mr-2" /> View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedReview(row);
              setIsDeleteDialogOpen(true);
            }}
          >
            <FaTrash className="mr-2" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {status === "loading" ? (
                  <p>Loading reviews...</p>
                ) : status === "failed" ? (
                  <p>Error loading reviews: {error}</p>
                ) : (
                  <Table
                    columns={columns}
                    data={reviews}
                    onRowClick={(row) => handleViewReview(row)}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogTitle>Review Details</DialogTitle>
              <DialogDescription>View review details.</DialogDescription>
              {selectedReview && (
                <div className="space-y-4">
                  <p>
                    <strong>Product:</strong> {selectedReview.productName}
                  </p>
                  <p>
                    <strong>Customer:</strong> {selectedReview.customerName}
                  </p>
                  <p>
                    <strong>Rating:</strong> {selectedReview.rating}/5
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedReview.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Content:</strong> {selectedReview.content}
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogTitle>Delete Review</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this review? This action cannot
                be undone.
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteReview}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Reviews;
