import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewslettersAsync,
  deleteNewsletterAsync,
} from "../store/newslettersSlice";
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
import { Button } from "../components/ui/button";

interface Newsletter {
  _id: string;
  email: string;
  createdAt: string;
}

export default function Newsletters() {
  const dispatch = useDispatch<AppDispatch>();
  const newsletters = useSelector(
    (state: RootState) => state.newsletters.newsletters
  );
  const isLoading = useSelector(
    (state: RootState) => state.newsletters.isLoading
  );
  const error = useSelector((state: RootState) => state.newsletters.error);

  const [selectedNewsletter, setSelectedNewsletter] =
    useState<Newsletter | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchNewslettersAsync());
  }, [dispatch]);

  const handleDeleteNewsletter = async () => {
    if (selectedNewsletter) {
      try {
        await dispatch(deleteNewsletterAsync(selectedNewsletter._id)).unwrap();
        toast.success("Newsletter subscription deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedNewsletter(null);
        // Refresh the list
        dispatch(fetchNewslettersAsync());
      } catch (error) {
        toast.error("Failed to delete newsletter subscription");
      }
    }
  };

  const openDeleteDialog = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setIsDeleteDialogOpen(true);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Pagination logic
  const indexOfLastNewsletter = currentPage * itemsPerPage;
  const indexOfFirstNewsletter = indexOfLastNewsletter - itemsPerPage;
  const currentNewsletters = newsletters.slice(
    indexOfFirstNewsletter,
    indexOfLastNewsletter
  );

  const totalPages = Math.ceil(newsletters.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: "Email",
      accessor: "email",
      filterable: true,
    },
    {
      header: "Subscribed On",
      accessor: "createdAt",
      cell: (item: Newsletter) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (item: Newsletter) => (
        <Button variant="outline" onClick={() => openDeleteDialog(item)}>
          Delete
        </Button>
      ),
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (isLoading) return <div>Loading...</div>;

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
            <h1 className="text-2xl font-semibold mb-4">
              Newsletter Management
            </h1>

            <Table columns={columns} data={currentNewsletters} />

            <Pagination className="mt-4">
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              <PaginationContent>
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
              </PaginationContent>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>

            {/* Delete Dialog */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={(open) => {
                setIsDeleteDialogOpen(open);
                if (!open) setSelectedNewsletter(null);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Newsletter</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this newsletter
                    subscription? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteNewsletter}
                  >
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
