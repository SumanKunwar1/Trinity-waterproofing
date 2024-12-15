import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
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
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Table from "../components/ui/table";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  total: number;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customerName: "John Doe",
      orderDate: "2023-06-01",
      status: "Pending",
      total: 99.99,
      items: [
        { id: 1, productName: "Waterproof Paint A", quantity: 2, price: 19.99 },
        { id: 2, productName: "Sealant X", quantity: 1, price: 29.99 },
      ],
    },
    {
      id: 2,
      customerName: "Jane Smith",
      orderDate: "2023-06-02",
      status: "Processing",
      total: 149.99,
      items: [
        {
          id: 3,
          productName: "Waterproof Membrane",
          quantity: 1,
          price: 79.99,
        },
        { id: 4, productName: "Waterproof Coating", quantity: 2, price: 34.99 },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (orderId: number, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const columns = [
    { header: "Order ID", accessor: "id", filterable: true },
    { header: "Customer Name", accessor: "customerName", filterable: true },
    { header: "Order Date", accessor: "orderDate", filterable: false },
    { header: "Status", accessor: "status", filterable: false },
    {
      header: "Total",
      accessor: "total",
      filterable: false,
      cell: (row: Order) => `$${row.total.toFixed(2)}`,
    },
    {
      header: "Actions",
      accessor: "actions",
      filterable: false,
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

  const data = orders.map((order) => ({
    ...order,
    actions: (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewOrder(order)}
      >
        <FaEye className="mr-2" /> View
      </Button>
    ),
  }));

  // Simulating real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === "Delivered") return order;
          const statuses: Order["status"][] = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
          ];
          const currentIndex = statuses.indexOf(order.status);
          if (Math.random() > 0.7 && currentIndex < statuses.length - 1) {
            const newStatus = statuses[currentIndex + 1];
            toast.info(`Order ${order.id} status updated to ${newStatus}`);
            return { ...order, status: newStatus };
          }
          return order;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
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
            <Table
              columns={columns}
              data={data}
              onRowClick={(row) => handleViewOrder(row)}
              itemsPerPage={5}
            />
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>View and manage order details.</DialogDescription>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Order ID: {selectedOrder.id}</h3>
                <p>Customer: {selectedOrder.customerName}</p>
                <p>Date: {selectedOrder.orderDate}</p>
                <p>Total: ${selectedOrder.total.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="list-disc pl-5">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} - Quantity: {item.quantity}, Price: $
                      {item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Status:</span>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value: Order["status"]) =>
                    handleStatusChange(selectedOrder.id, value)
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
