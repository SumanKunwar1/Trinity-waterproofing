import { useEffect, useState } from "react";
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
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
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

type Order = {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    role: string;
  };
  products: any[];
  subtotal: number;
  status: string;
  createdAt: string;
  reason: string | null;
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

function DataTable({
  columns,
  data,
}: {
  columns: ColumnDef<Order, any>[];
  data: Order[];
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => table.setPageIndex(i)}
                  isActive={table.getState().pagination.pageIndex === i}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.orders
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    dispatch(fetchOrdersAsync());
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await dispatch(updateOrderStatusAsync({ orderId, newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleCancelOrder = async () => {
    if (selectedOrder && cancelReason) {
      try {
        await dispatch(
          cancelOrderAsync({ orderId: selectedOrder._id, reason: cancelReason })
        );
        toast.success("Order cancelled successfully");
        setIsCancelDialogOpen(false);
      } catch (error) {
        toast.error("Failed to cancel order");
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        await dispatch(deleteOrderAsync(selectedOrder._id));
        toast.success("Order deleted successfully");
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast.error("Failed to delete order");
      }
    }
  };

  const handleMarkOrderShipped = async (orderId: string) => {
    try {
      await dispatch(markOrderShippedAsync(orderId));
      toast.success("Order marked as shipped");
    } catch (error) {
      toast.error("Failed to mark order as shipped");
    }
  };

  const handleMarkOrderDelivered = async (orderId: string) => {
    try {
      await dispatch(markOrderDeliveredAsync(orderId));
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error("Failed to mark order as delivered");
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "_id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("_id")}</span>
      ),
    },
    {
      accessorKey: "userId",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.userId.fullName}</div>
          <div className="text-sm text-gray-500 capitalize">
            {row.original.userId.role}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        return format(new Date(row.getValue("createdAt")), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "subtotal",
      header: "Total",
      cell: ({ row }) => {
        const amount = row.getValue<number>("subtotal");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "NPR",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleStatusChange(order._id, "order-confirmed")}
              >
                Mark as Confirmed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMarkOrderShipped(order._id)}
              >
                Mark as Shipped
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMarkOrderDelivered(order._id)}
              >
                Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrder(order);
                  setIsCancelDialogOpen(true);
                }}
                className="text-red-600"
              >
                Cancel Order
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrder(order);
                  setIsDeleteDialogOpen(true);
                }}
                className="text-red-600"
              >
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (status === "failed") return <div>Error: {error}</div>;

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
                  <DataTable columns={columns} data={orders} />
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
    </div>
  );
}

export default Orders;
