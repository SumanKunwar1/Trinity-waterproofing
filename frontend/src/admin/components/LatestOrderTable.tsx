import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { format } from "date-fns";
import { IOrder } from "../pages/Dashboard"; // Import IOrder from Dashboard

interface LatestOrderTableProps {
  orders: IOrder[];
}

const LatestOrderTable: React.FC<LatestOrderTableProps> = ({ orders }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>{order._id}</TableCell>
            <TableCell>{order.userId.fullName}</TableCell>
            <TableCell>Rs {order.subtotal.toFixed(2)}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>
              {format(new Date(order.createdAt), "MMM dd, yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestOrderTable;
