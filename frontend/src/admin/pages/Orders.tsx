import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Table from "../components/ui/table";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchOrders,
  updateOrderStatus,
  cancelOrder,
  Order,
} from "../store/ordersSlice";

const Orders: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders())
      .then((result) => {
        console.log("Orders fetched successfully:", result);
      })
      .catch((error) => {
        console.error("Failed to fetch orders:", error);
      });
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await dispatch(updateOrderStatus({ orderId, newStatus })).unwrap();
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };
  const handleCancelOrder = async () => {
    if (selectedOrder) {
      try {
        await dispatch(
          cancelOrder({ orderId: selectedOrder.id, reason: cancelReason })
        ).unwrap();
        toast.success(`Order ${selectedOrder.id} has been cancelled`);
        setIsCancelDialogOpen(false);
      } catch (error) {
        toast.error("Failed to cancel order");
      }
    }
  };

  const columns = [
    { header: "Order ID", accessor: "id" },
    { header: "Customer Name", accessor: "customerName" },
    { header: "Order Date", accessor: "orderDate" },
    {
      header: "Status",
      accessor: "status",
      cell: (row: Order) => (
        <Select
          value={row.status}
          onValueChange={(value: Order["status"]) =>
            handleStatusChange(row.id, value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Total",
      accessor: "total",
      cell: (row: Order) => `$${row.total}`,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: Order) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewOrder(row)}
        >
          <FaEye className="mr-2" /> View
        </Button>
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
                <CardTitle className="text-2xl font-bold">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {status === "loading" ? (
                  <p>Loading orders...</p>
                ) : status === "failed" ? (
                  <p>Error loading orders: {error}</p>
                ) : (
                  <Table
                    columns={columns}
                    data={orders}
                    onRowClick={(row) => handleViewOrder(row)}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                View and manage order details.
              </DialogDescription>
              {selectedOrder && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">
                      Order ID: {selectedOrder.id}
                    </h3>
                    <p>Customer: {selectedOrder.customerName}</p>
                    <p>Date: {selectedOrder.orderDate}</p>
                    <p>Total: ${selectedOrder.total}</p>
                    <p>Status: {selectedOrder.status}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <ul className="list-disc pl-5">
                      {selectedOrder.items.map((item) => (
                        <li key={item.id}>
                          {item.productName} - Quantity: {item.quantity}, Price:
                          ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={isCancelDialogOpen}
            onOpenChange={setIsCancelDialogOpen}
          >
            <DialogContent>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? Please provide a
                reason.
              </DialogDescription>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason"
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(false)}
                >
                  <FaTimes className="mr-2" /> Cancel
                </Button>
                <Button onClick={handleCancelOrder} disabled={!cancelReason}>
                  <FaCheck className="mr-2" /> Confirm Cancellation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Orders;
