import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviewsAsync,
  deleteReviewAsync,
  Review,
  Product,
} from "../store/reviewsSlice";
import { AppDispatch, RootState } from "../store/store";
import { motion } from "framer-motion";
import Table from "../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Reviews() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.reviews.products);
  const isLoading = useSelector((state: RootState) => state.reviews.isLoading);
  const error = useSelector((state: RootState) => state.reviews.error);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchReviewsAsync());
  }, [dispatch]);

  const handleDeleteReview = async () => {
    if (selectedReview) {
      try {
        await dispatch(deleteReviewAsync(selectedReview._id)).unwrap();
        toast.success("Review deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedReview(null);
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          toast.error("You don't have permission to delete this review");
        } else {
          toast.error("Failed to delete review");
        }
        console.error("Error deleting review:", error);
      }
    }
  };

  const openViewDialog = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Safely flatten the products array to get all reviews
  const allReviews = products.flatMap((product: Product) =>
    product.review.map((review: Review) => ({
      ...review,
      productName: product.name,
    }))
  );

  // Pagination logic
  const indexOfLastReview = currentPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = allReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const totalPages = Math.ceil(allReviews.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: "Product",
      accessor: "productName",
      filterable: true,
    },
    {
      header: "Review Content",
      accessor: "content",
      filterable: true,
    },
    {
      header: "Rating",
      accessor: "rating",
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (item: Review) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Username",
      accessor: "fullName",
      filterable: true,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (item: Review) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                openViewDialog(item);
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                openDeleteDialog(item);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-semibold">Reviews</h1>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                <Table
                  columns={columns}
                  data={currentReviews}
                  onRowClick={(item) => openViewDialog(item as Review)}
                />

                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}

            {/* View Dialog */}
            <Dialog
              open={isViewDialogOpen}
              onOpenChange={(open) => {
                setIsViewDialogOpen(open);
                if (!open) setSelectedReview(null);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review Details</DialogTitle>
                </DialogHeader>
                {selectedReview && (
                  <div className="space-y-2">
                    <p>
                      <strong>Product:</strong> {selectedReview.productName}
                    </p>
                    <p>
                      <strong>Rating:</strong> {selectedReview.rating}/5
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(selectedReview.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Content:</strong> {selectedReview.content}
                    </p>
                    <p>
                      <strong>Full Name:</strong> {selectedReview.fullName}
                    </p>
                    <p>
                      <strong>Number:</strong> {selectedReview.number}
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={(open) => {
                setIsDeleteDialogOpen(open);
                if (!open) setSelectedReview(null);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Review</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this review? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
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
          </motion.div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
