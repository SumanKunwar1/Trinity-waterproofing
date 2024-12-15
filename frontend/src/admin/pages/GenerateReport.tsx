import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaFileAlt } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Ensure this import is here
import * as XLSX from "xlsx";
import { Button } from "../components/ui/button";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

const GenerateReport: React.FC = () => {
  const [reportType, setReportType] = useState<string>("orders");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [fileFormat, setFileFormat] = useState<string>("pdf");

  // Function to generate mock report data with filtering based on date range
  const generateReportData = (
    type: string,
    startDate: Date | null,
    endDate: Date | null
  ) => {
    const mockData = {
      orders: [
        { id: 1, date: "2024-12-01", total: 100 },
        { id: 2, date: "2024-12-02", total: 200 },
        { id: 3, date: "2024-12-03", total: 150 },
        { id: 4, date: "2024-12-10", total: 250 },
      ],
      products: [
        { id: 1, name: "Product A", stock: 100, price: 50 },
        { id: 2, name: "Product B", stock: 75, price: 60 },
        { id: 3, name: "Product C", stock: 120, price: 40 },
      ],
      categories: [
        { id: 1, name: "Category A", productCount: 10 },
        { id: 2, name: "Category B", productCount: 15 },
        { id: 3, name: "Category C", productCount: 8 },
      ],
    };

    const data = mockData[type as keyof typeof mockData];

    // Filter data by date range (only for orders)
    if (type === "orders" && startDate && endDate) {
      return data.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    return data; // For other types (e.g., products, categories), no date filtering needed
  };

  // Function to generate PDF report
  const generatePDF = (data: any[]) => {
    const doc = new jsPDF();
    doc.text(
      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      14,
      15
    );
    if (dateRange.from && dateRange.to) {
      doc.text(
        `Date Range: ${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}`,
        14,
        25
      );
    }

    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map(Object.values),
      startY: 35,
    });

    doc.save(`${reportType}_report.pdf`);
  };

  // Function to generate CSV report
  const generateCSV = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}_report.csv`);
  };

  // Function to generate Excel report
  const generateExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
  };

  // Function to handle report generation based on selected options
  const handleGenerateReport = () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select a valid date range");
      return;
    }

    const data = generateReportData(reportType, dateRange.from, dateRange.to);

    if (data.length === 0) {
      toast.error("No data found for the selected date range");
      return;
    }

    switch (fileFormat) {
      case "pdf":
        generatePDF(data);
        break;
      case "csv":
        generateCSV(data);
        break;
      case "excel":
        generateExcel(data);
        break;
      default:
        toast.error("Invalid file format");
        return;
    }

    toast.success(
      `${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } report generated successfully!`
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Generate Report</h2>
      <div className="space-y-4">
        {/* Report Type Dropdown */}
        <div>
          <label
            htmlFor="report-type"
            className="block text-sm font-medium text-gray-700"
          >
            Report Type
          </label>
          <select
            id="report-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="orders">Orders Report</option>
            <option value="products">Products Report</option>
            <option value="categories">Categories Report</option>
          </select>
        </div>

        {/* Date Range Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="date"
              value={
                dateRange.from ? dateRange.from.toISOString().split("T")[0] : ""
              }
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  from: new Date(e.target.value),
                }))
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              type="date"
              value={
                dateRange.to ? dateRange.to.toISOString().split("T")[0] : ""
              }
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  to: new Date(e.target.value),
                }))
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* File Format Radio Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            File Format
          </label>
          <div className="mt-2 space-x-4">
            {["pdf", "csv", "excel"].map((format) => (
              <label key={format} className="inline-flex items-center">
                <input
                  type="radio"
                  value={format}
                  checked={fileFormat === format}
                  onChange={(e) => setFileFormat(e.target.value)}
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2">{format.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Report Button */}
        <Button
          onClick={handleGenerateReport}
          variant="secondary"
          className="w-full"
        >
          <FaFileAlt className="mr-2" /> Generate Report
        </Button>
      </div>
    </div>
  );
};

export default GenerateReport;
