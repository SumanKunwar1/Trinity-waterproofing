import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye, FaTrash, FaEllipsisV } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import Table from "../components/ui/table";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../components/ui/pagination";

interface Enquiry {
  _id: string;
  fullName: string;
  number: string;
  email: string;
  message: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

const Enquiries: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchEnquiries();
  }, [currentPage]);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/enquiry?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch enquiries");
      }

      const data = await response.json();
      setEnquiries(data);
    } catch (error: any) {
      console.error("Error fetching enquiries:", error);
      toast.error(error.message || "Failed to fetch enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (enquiry: Enquiry) => {
    setViewingEnquiry(enquiry);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/enquiry/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete enquiry");
      }

      toast.success("Enquiry deleted successfully");
      setEnquiries((prevEnquiries) =>
        prevEnquiries.filter((enquiry) => enquiry._id !== id)
      );

      // If the current page is empty after deletion, go to the previous page
      if (enquiries.length === 1 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      } else {
        fetchEnquiries(); // Refetch to update the list and total count
      }
    } catch (error: any) {
      console.error("Error deleting enquiry:", error);
      toast.error(error.message || "Failed to delete enquiry");
    }
  };

  const indexOfLastEnquiry = currentPage * itemsPerPage;
  const indexOfFirstEnquiry = indexOfLastEnquiry - itemsPerPage;
  const currentEnquiry = enquiries.slice(
    indexOfFirstEnquiry,
    indexOfLastEnquiry
  );

  const totalPages = Math.ceil(enquiries.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { header: "Fullname", accessor: "fullName" },
    { header: "Phone Number", accessor: "number" },
    { header: "Email", accessor: "email" },
    {
      header: "Message",
      accessor: "message",
      cell: (row: Enquiry) => (
        <div className="max-w-xs truncate">{row.message}</div>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (row: Enquiry) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: Enquiry) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <FaEllipsisV className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row)}>
              <FaEye className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row._id)}>
              <FaTrash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">
                    Enquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      <Table data={enquiries} columns={columns} />
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
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Enquiry Details</DialogTitle>
          {viewingEnquiry && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Fullname</h3>
                <p>{viewingEnquiry.fullName}</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone Number</h3>
                <p>{viewingEnquiry.number}</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>{viewingEnquiry.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Message</h3>
                <p>{viewingEnquiry.message}</p>
              </div>
              <div>
                <h3 className="font-semibold">Date</h3>
                <p>{new Date(viewingEnquiry.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Enquiries;
