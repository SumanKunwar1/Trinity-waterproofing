import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaDownload } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Add the necessary CSS for the date picker
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Ensure this import is here
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>("sales");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12000, 19000, 3000, 5000, 2000, 3000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const productPerformanceData = {
    labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
    datasets: [
      {
        label: "Units Sold",
        data: [300, 250, 200, 150, 100],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const customerAnalyticsData = {
    labels: ["New Customers", "Returning Customers"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
      },
    ],
  };

  const renderChart = () => {
    switch (selectedReport) {
      case "sales":
        return <Bar data={salesData} />;
      case "product-performance":
        return <Line data={productPerformanceData} />;
      case "customer-analytics":
        return <Pie data={customerAnalyticsData} />;
      default:
        return null;
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text(
      `${
        selectedReport.charAt(0).toUpperCase() +
        selectedReport.slice(1).replace("-", " ")
      } Report`,
      14,
      15
    );

    // Adding chart to PDF
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 14, 30, 180, 100); // Adding chart image to the PDF
    }

    // Adding details
    doc.text("Report Details:", 14, 140);
    doc.text(
      `Report Type: ${
        selectedReport.charAt(0).toUpperCase() +
        selectedReport.slice(1).replace("-", " ")
      }`,
      14,
      150
    );
    doc.text(
      `Selected Date: ${
        selectedDate ? selectedDate.toLocaleDateString() : "Not selected"
      }`,
      14,
      160
    );

    // Example of adding key insights
    doc.text("Key Insights:", 14, 170);
    doc.autoTable({
      head: [["Insight", "Value"]],
      body: [
        ["Total Revenue", "$44,000"],
        ["Best Selling Product", "Product A"],
        ["New Customer Growth", "15%"],
      ],
      startY: 175,
    });

    // Save PDF
    doc.save(`${selectedReport}_report.pdf`);
    toast.success("Report downloaded successfully!");
  };

  const handleDownload = () => {
    // Trigger PDF generation
    generatePDFReport();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="product-performance">
                    Product Performance
                  </SelectItem>
                  <SelectItem value="customer-analytics">
                    Customer Analytics
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Date Picker component */}
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="yyyy/MM/dd"
                placeholderText="Select Date"
                className="w-48 p-2 rounded-md"
              />

              <Button onClick={handleDownload} variant="default">
                <FaDownload className="mr-2" /> Download Report
              </Button>
              <Link to="/generate-report">
                <Button variant="outline">
                  <FaFileAlt className="mr-2" /> Generate Custom Report
                </Button>
              </Link>
            </div>
            <div className="h-[400px]">{renderChart()}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Report Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Report Type:</h3>
                <p>
                  {selectedReport.charAt(0).toUpperCase() +
                    selectedReport.slice(1).replace("-", " ")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Selected Date:</h3>
                <p>
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Not selected"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Key Insights:</h3>
                <ul className="list-disc pl-5">
                  <li>Total Revenue: $44,000</li>
                  <li>Best Selling Product: Product A</li>
                  <li>New Customer Growth: 15%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;
