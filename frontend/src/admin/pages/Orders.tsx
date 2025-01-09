import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersAsync,
  updateOrderStatusAsync,
  cancelOrderAsync,
  deleteOrderAsync,
  markOrderShippedAsync,
  markOrderDeliveredAsync,
} from "../store/ordersSlice";
import { AppDispatch, RootState } from "../store/store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Table from "../components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

type Order = {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    role: string;
  };
  address: {
    _id: string;
    street: string;
    city: string;
    province: string;
    district: string;
    postalCode: string;
    country: string;
  };
  products: any[];
  subtotal: number;
  status: string;
  createdAt: string;
  reason: string | null;
  paymentMethod: string | null; // Added paymentMethod field
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    "order-requested": { bg: "bg-blue-100 text-blue-800", label: "Requested" },
    "order-confirmed": {
      bg: "bg-green-100 text-green-800",
      label: "Confirmed",
    },
    "order-shipped": { bg: "bg-purple-100 text-purple-800", label: "Shipped" },
    "order-delivered": { bg: "bg-gray-100 text-gray-800", label: "Delivered" },
    "order-cancelled": { bg: "bg-red-100 text-red-800", label: "Cancelled" },
  } as const;

  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig["order-requested"];

  return (
    <Badge
      className={`${config.bg} px-3 py-1 rounded-full font-medium text-sm`}
    >
      {config.label}
    </Badge>
  );
};

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.orders
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewMoreDialogOpen, setIsViewMoreDialogOpen] = useState(false); // Added state for View More dialog
  const [cancelReason, setCancelReason] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    dispatch(fetchOrdersAsync());
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const result = await dispatch(
        updateOrderStatusAsync({ orderId, newStatus })
      ).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update order status"
      );
    }
  };

  const handleCancelOrder = async () => {
    if (selectedOrder && cancelReason) {
      try {
        await dispatch(
          cancelOrderAsync({ orderId: selectedOrder._id, reason: cancelReason })
        ).unwrap();
        toast.success("Order cancelled successfully");
        setIsCancelDialogOpen(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to cancel order"
        );
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        await dispatch(deleteOrderAsync(selectedOrder._id)).unwrap();
        toast.success("Order deleted successfully");
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete order"
        );
      }
    }
  };

  const handleMarkOrderShipped = async (orderId: string) => {
    try {
      await dispatch(markOrderShippedAsync(orderId)).unwrap();
      toast.success("Order marked as shipped");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to mark order as shipped"
      );
    }
  };

  const handleMarkOrderDelivered = async (orderId: string) => {
    try {
      await dispatch(markOrderDeliveredAsync(orderId)).unwrap();
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to mark order as delivered"
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Order ID",
        accessor: "_id",
        cell: (item: Order) => <span className="font-medium">{item._id}</span>,
      },
      {
        header: "Customer",
        accessor: "userId.fullName",
        filterable: true,
        cell: (item: Order) => (
          <div>
            <div className="font-medium">{item.userId.fullName}</div>
            <div className="text-sm text-gray-500 capitalize">
              {item.userId.role}
            </div>
          </div>
        ),
      },
      {
        header: "Date",
        accessor: "createdAt",
        filterable: true,
        cell: (item: Order) => format(new Date(item.createdAt), "MMM dd, yyyy"),
      },
      {
        header: "Status",
        accessor: "status",
        cell: (item: Order) => getStatusBadge(item.status),
      },
      {
        header: "Total",
        accessor: "subtotal",
        cell: (item: Order) => (
          <div className="text-right font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "NPR",
            }).format(item.subtotal)}
          </div>
        ),
      },
      {
        header: "Actions",
        accessor: "actions",
        cell: (item: Order) => (
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
              <DropdownMenuLabel className="font-semibold text-center">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="border-b border-t border-gray-300 hover:rounded-md hover:bg-button hover:text-white"
                onClick={() => {
                  setSelectedOrder(item);
                  setIsViewMoreDialogOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="border-b border-gray-300 hover:rounded-md "
                onClick={() => handleStatusChange(item._id, "order-confirmed")}
              >
                Mark as Confirmed
              </DropdownMenuItem>
              <DropdownMenuItem
                className="border-b border-gray-300 "
                onClick={() => handleMarkOrderShipped(item._id)}
              >
                Mark as Shipped
              </DropdownMenuItem>
              <DropdownMenuItem
                className="border-b border-gray-300 "
                onClick={() => handleMarkOrderDelivered(item._id)}
              >
                Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrder(item);
                  setIsCancelDialogOpen(true);
                }}
                className="text-red-600 border-b border-gray-300 "
              >
                Cancel Order
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrder(item);
                  setIsDeleteDialogOpen(true);
                }}
                className="text-red-600 ext-red-600"
              >
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesCustomer =
          !customerFilter ||
          order.userId.fullName
            .toLowerCase()
            .includes(customerFilter.toLowerCase());
        const matchesDate =
          !dateFilter ||
          format(new Date(order.createdAt), "yyyy-MM-dd") === dateFilter;
        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;
        return matchesCustomer && matchesDate && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [orders, customerFilter, dateFilter, statusFilter]);

  const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

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
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Tabs
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      className="w-full"
                    >
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="order-requested">
                          Requested
                        </TabsTrigger>
                        <TabsTrigger value="order-confirmed">
                          Confirmed
                        </TabsTrigger>
                        <TabsTrigger value="order-shipped">Shipped</TabsTrigger>
                        <TabsTrigger value="order-delivered">
                          Delivered
                        </TabsTrigger>
                        <TabsTrigger value="order-cancelled">
                          Cancelled
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Table
                      columns={columns}
                      data={paginatedOrders}
                      onRowClick={(item) => console.log("Clicked row:", item)}
                    />
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          />
                        </PaginationItem>
                        {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                          (page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, pageCount)
                              )
                            }
                            disabled={currentPage === pageCount}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Reason for cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={!cancelReason}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Confirm Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewMoreDialogOpen}
        onOpenChange={setIsViewMoreDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Customer</h3>
                  <p>{selectedOrder.userId.fullName}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Order ID</h3>
                  <p>{selectedOrder._id}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Date</h3>
                  <p>
                    {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>{getStatusBadge(selectedOrder.status)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>
                  {[
                    selectedOrder.address.street,
                    selectedOrder.address.city,
                    selectedOrder.address.province,
                    selectedOrder.address.district,
                    selectedOrder.address.postalCode,
                    selectedOrder.address.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Method</h3>
                <p>{selectedOrder.paymentMethod || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Products</h3>
                <ul className="list-disc pl-5">
                  {selectedOrder.products.map((product: any, index: number) => (
                    <li key={index}>
                      {product.productId.name} (Qty: {product.quantity} x Price:{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "NPR",
                      }).format(product.price)}
                      )
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Subtotal</h3>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "NPR",
                  }).format(selectedOrder.subtotal)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewMoreDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Orders;
