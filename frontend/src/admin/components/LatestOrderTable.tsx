import React from "react";
import Table from "../components/ui/table"; // Path to your Table component

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface LatestOrderTableProps {
  order: Order | null;
}

const LatestOrderTable: React.FC<LatestOrderTableProps> = ({ order }) => {
  if (!order) {
    return <p>No recent orders.</p>;
  }

  // Define table columns for orders
  const columns = [
    {
      header: "Order ID",
      accessor: "id",
    },
    {
      header: "Customer",
      accessor: "customerName",
    },
    {
      header: "Total",
      accessor: "total",
      cell: (item: Order) => `$${item.total}`, // Custom cell formatting for total
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (item: Order) => new Date(item.createdAt).toLocaleString(), // Format date
    },
  ];

  // Create data array for the table (we're using the single order here)
  const data = [order];

  return (
    <Table columns={columns} data={data} itemsPerPage={1} /> // Only 1 item per page as it's a single order
  );
};

export default LatestOrderTable;
