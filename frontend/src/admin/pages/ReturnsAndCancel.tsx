import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

interface Product {
  productId: {
    name: string;
  };
}

interface Order {
  _id: string;
  products: Product[];
  reason: string;
  status: string;
  createdAt: string;
}

function AdminReturnsAndCancellations() {
  const [items, setItems] = useState<Order[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDisapproveDialogOpen, setIsDisapproveDialogOpen] = useState(false);
  const [disapprovalReason, setDisapprovalReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const itemsPerPage = 10;

  const filteredItems = items.filter((item) =>
    statusFilter ? item.status === statusFilter : true
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/order/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch orders");
      }
      const data = await response.json();
      setItems(
        data.filter((order: Order) =>
          [
            "return-requested",
            "return-approved",
            "return-disapproved",
          ].includes(order.status)
        )
      );

      setStatus("idle");
    } catch (error: any) {
      setStatus("failed");
      setError(error.message || "Failed to fetch orders");
      toast.error(error.message || "Failed to fetch orders");
    }
  };

  const handleApprove = async () => {
    if (selectedItem) {
      try {
        const response = await fetch(
          `/api/order/admin/${selectedItem._id}/approve-return`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to approve return");
        }
        await fetchOrders();
        toast.success("Return approved successfully");
        setIsApproveDialogOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Failed to approve return");
      }
    }
  };

  const handleDisapprove = async () => {
    if (selectedItem && disapprovalReason) {
      try {
        const response = await fetch(
          `/api/order/admin/${selectedItem._id}/disapprove-return`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({ reason: disapprovalReason }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to disapprove return");
        }
        await fetchOrders();
        toast.success("Return disapproved");
        setIsDisapproveDialogOpen(false);
        setDisapprovalReason("");
      } catch (error: any) {
        toast.error(error.message || "Failed to disapprove return");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (status === "failed") return <div>Error: {error}</div>;

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
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Returns & Cancellations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex space-x-2">
                  <Button
                    onClick={() => setStatusFilter(null)}
                    variant={statusFilter === null ? "default" : "outline"}
                  >
                    All
                  </Button>
                  <Button
                    onClick={() => setStatusFilter("return-approved")}
                    variant={
                      statusFilter === "return-approved" ? "default" : "outline"
                    }
                  >
                    Approved
                  </Button>
                  <Button
                    onClick={() => setStatusFilter("return-disapproved")}
                    variant={
                      statusFilter === "return-disapproved"
                        ? "default"
                        : "outline"
                    }
                  >
                    Disapproved
                  </Button>
                  <Button
                    onClick={() => setStatusFilter("return-requested")}
                    variant={
                      statusFilter === "return-requested"
                        ? "default"
                        : "outline"
                    }
                  >
                    Requested
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item._id}</TableCell>
                        <TableCell>
                          {item.products
                            .map((product) => product.productId?.name)
                            .join(", ")}
                        </TableCell>
                        <TableCell>
                          {item.reason.split(" ").length > 20 ? (
                            <span>
                              {item.reason.split(" ").slice(0, 20).join(" ")}...{" "}
                            </span>
                          ) : (
                            item.reason
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status.includes("approved")
                                ? "bg-[#c4e1c5] text-green-800"
                                : item.status.includes("disapproved")
                                ? "bg-red-200 text-red-800"
                                : ""
                            }
                          >
                            {item.status.toUpperCase().replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-5 h-5"
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsApproveDialogOpen(true);
                                }}
                              >
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsDisapproveDialogOpen(true);
                                }}
                              >
                                Disapprove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return & Cancel Details</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-2 text-md">
            <p>
              <strong>Order ID:</strong> {selectedItem?._id}
            </p>
            <p>
              <strong>Products:</strong>{" "}
              {selectedItem?.products
                .map((product) => product.productId?.name)
                .join(", ")}
            </p>
            <p>
              <strong>Reason:</strong> {selectedItem?.reason}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedItem?.status.toUpperCase().replace("-", " ")}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {selectedItem
                ? new Date(selectedItem.createdAt).toLocaleDateString()
                : ""}
            </p>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setSelectedItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Return</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this return request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove}>Confirm Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDisapproveDialogOpen}
        onOpenChange={setIsDisapproveDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disapprove Return</DialogTitle>
            <DialogDescription>
              Please provide a reason for disapproving this return request.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Reason for disapproval"
            value={disapprovalReason}
            onChange={(e) => setDisapprovalReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDisapproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisapprove}
              disabled={!disapprovalReason}
            >
              Confirm Disapproval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminReturnsAndCancellations;
