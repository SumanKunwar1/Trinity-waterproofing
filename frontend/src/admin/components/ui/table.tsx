import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Input } from "./input";
import { Button } from "./button";

interface Column {
  header: string;
  accessor: string;
  filterable?: boolean;
  cell?: (item: any, index: number) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (item: any) => void;
  itemsPerPage?: number;
  startIndex?: number;
}

const Table: React.FC<TableProps> = ({
  columns,
  data = [],
  onRowClick,
  itemsPerPage = 10,
  startIndex = 1,
}) => {
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const allColumns = useMemo(
    () => [
      {
        header: "S.N",
        accessor: "serialNumber",
        cell: (_, index: number) => startIndex + index,
      },
      ...columns,
    ],
    [columns, startIndex]
  );

  const handleSort = (accessor: string) => {
    if (accessor === "serialNumber") return;
    if (sortColumn === accessor) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(accessor);
      setSortDirection("asc");
    }
  };

  const handleFilter = (accessor: string, value: string) => {
    if (accessor === "serialNumber") return;
    setFilters((prev) => ({ ...prev, [accessor]: value }));
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        const itemValue = item[key];
        return (
          itemValue &&
          itemValue.toString().toLowerCase().includes(value.toLowerCase())
        );
      });
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortColumn) {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {allColumns.map((column, index) => (
                <th
                  key={index}
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  <div className="flex flex-col">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort(column.accessor)}
                    >
                      {column.header}
                      {sortColumn === column.accessor ? (
                        sortDirection === "asc" ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1" />
                      )}
                    </div>
                    {column.filterable && (
                      <Input
                        type="text"
                        placeholder={`Filter ${column.header}`}
                        className="mt-2 text-sm"
                        value={filters[column.accessor] || ""}
                        onChange={(e) =>
                          handleFilter(column.accessor, e.target.value)
                        }
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <motion.tr
                key={index}
                whileHover={{ scale: 1.01 }}
                onClick={() => onRowClick && onRowClick(item)}
                className="hover:bg-gray-100 cursor-pointer"
              >
                {allColumns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                  >
                    {column.cell
                      ? column.cell(item, index)
                      : column.accessor === "serialNumber"
                      ? startIndex + index + (currentPage - 1) * itemsPerPage
                      : item[column.accessor]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
            {sortedData.length} entries
          </span>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
