import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsAsync, deleteReviewAsync } from "../store/reviewsSlice";
import { AppDispatch, RootState } from "../store/store";
import { motion } from "framer-motion";
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
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
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Review } from "../../types/review";

export default function Reviews() {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector((state: RootState) => state.reviews.reviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReviewsAsync());
  }, [dispatch]);

  const handleDeleteReview = async () => {
    if (selectedReview) {
      try {
        await dispatch(deleteReviewAsync(selectedReview.id)).unwrap();
        toast.success("Review deleted successfully");
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: "name",
      header: "Product",
    },
    {
      accessorKey: "content",
      header: "Review Content",
    },
    {
      accessorKey: "rating",
      header: "Rating",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const review = row.original;
        return (
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
                onClick={() => {
                  setSelectedReview(review);
                  setIsViewDialogOpen(true);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedReview(review);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: reviews,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
            <div className="rounded-md border">
              <table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-4 py-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review Details</DialogTitle>
                </DialogHeader>
                {selectedReview && (
                  <div className="space-y-2">
                    <p>
                      <strong>Product:</strong> {selectedReview.name}
                    </p>
                    <p>
                      <strong>Rating:</strong> {selectedReview.rating}/5
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(selectedReview.date).toLocaleString()}
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
    </div>
  );
}
