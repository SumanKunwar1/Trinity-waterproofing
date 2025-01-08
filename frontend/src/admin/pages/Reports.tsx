import React, { useState, useEffect } from "react";
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
import "react-datepicker/dist/react-datepicker.css";
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
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  fetchProducts,
  fetchOrders,
  fetchCategories,
  fetchSubcategories,
} from "../utils/api";

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

interface ReportData {
  labels: string[];
  data: number[];
  insights: { label: string; value: string }[];
}

const Reports: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>("orders");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchData();
  }, [selectedReport, selectedDate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let data: ReportData;
      switch (selectedReport) {
        case "orders":
          data = await generateOrdersReport();
          break;
        case "products":
          data = await generateProductsReport();
          break;
        case "categories":
          data = await generateCategoriesReport();
          break;
        case "customers":
          data = await generateCustomersReport();
          break;
        default:
          throw new Error("Invalid report type");
      }
      setReportData(data);
      toast.success("Report data fetched successfully");
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to fetch report data");
    }
    setIsLoading(false);
  };

  const generateOrdersReport = async (): Promise<ReportData> => {
    const orders = await fetchOrders();
    const filteredOrders = selectedDate
      ? orders.filter(
          (order: any) =>
            new Date(order.createdAt).toDateString() ===
            selectedDate.toDateString()
        )
      : orders;

    const labels = filteredOrders.map((order: any) =>
      new Date(order.createdAt).toLocaleDateString()
    );
    // Get the total revenue by summing up the price of each product in each order
    const data = filteredOrders.map((order: any) =>
      order.products.reduce(
        (total: number, product: any) => total + product.price,
        0
      )
    );

    // Calculate total revenue
    const totalRevenue = data.reduce(
      (sum: number, value: number) => sum + value,
      0
    );

    // Calculate average order value (handle case of empty data)
    const averageOrderValue = data.length > 0 ? totalRevenue / data.length : 0;

    return {
      labels,
      data,
      insights: [
        { label: "Total Orders", value: filteredOrders.length.toString() },
        { label: "Total Revenue", value: `Rs ${totalRevenue.toFixed(2)}` },
        {
          label: "Average Order Value",
          value: `Rs ${averageOrderValue.toFixed(2)}`,
        },
      ],
    };
  };

  const generateProductsReport = async (): Promise<ReportData> => {
    const orders = await fetchOrders(); // Fetch orders instead of products directly

    // Create a map to hold the sales data for each product
    const productSalesMap = new Map();

    // Iterate through orders and update sales data for each product
    orders.forEach((order: any) => {
      order.products.forEach((product: any) => {
        const totalProductSales = product.price * product.quantity;

        // If the product already exists in the map, add the sales; otherwise, initialize it
        if (productSalesMap.has(product.productId.toString())) {
          productSalesMap.set(
            product.productId.toString(),
            productSalesMap.get(product.productId.toString()) +
              totalProductSales
          );
        } else {
          productSalesMap.set(product.productId.toString(), totalProductSales);
        }
      });
    });

    // Convert the sales map to an array and sort by sales
    const sortedProducts = Array.from(productSalesMap.entries()).map(
      ([productId, sales]) => ({ productId, sales })
    );

    sortedProducts.sort((a: any, b: any) => b.sales - a.sales);

    // Slice the top 10 selling products
    const topSellingProducts = sortedProducts.slice(0, 10);

    // Create labels and data arrays for chart rendering
    const labels = topSellingProducts.map((product: any) => {
      const productInfo = product.find(
        (p: any) => p._id.toString() === product.productId
      );
      return productInfo ? productInfo.name : "Unknown Product"; // Replace with actual product name
    });
    const data = topSellingProducts.map((product: any) => product.sales);

    // Return report data
    return {
      labels,
      data,
      insights: [
        { label: "Total Products", value: product.length.toString() },
        { label: "Top Selling Product", value: labels[0] },
        {
          label: "Total Sales",
          value: data
            .reduce((sum: number, value: number) => sum + value, 0)
            .toFixed(2),
        },
      ],
    };
  };

  const generateCategoriesReport = async (): Promise<ReportData> => {
    const categories = await fetchCategories();
    const subcategories = await fetchSubcategories();

    const labels = categories.map((category: any) => category.name);
    const data = categories.map((category: any) => {
      return subcategories.filter(
        (subcategory: any) => subcategory.categoryId === category.id
      ).length;
    });

    return {
      labels,
      data,
      insights: [
        { label: "Total Categories", value: categories.length.toString() },
        {
          label: "Total Subcategories",
          value: subcategories.length.toString(),
        },
        {
          label: "Most Diverse Category",
          value: labels[data.indexOf(Math.max(...data))],
        },
      ],
    };
  };

  const generateCustomersReport = async (): Promise<ReportData> => {
    const orders = await fetchOrders();
    const customerMap = new Map();

    orders.forEach((order: any) => {
      const customerId = order.userId;
      if (customerMap.has(customerId)) {
        customerMap.set(customerId, customerMap.get(customerId) + 1);
      } else {
        customerMap.set(customerId, 1);
      }
    });

    const labels = ["1 Order", "2-5 Orders", "6-10 Orders", "10+ Orders"];
    const data = [0, 0, 0, 0];

    customerMap.forEach((orderCount) => {
      if (orderCount === 1) data[0]++;
      else if (orderCount >= 2 && orderCount <= 5) data[1]++;
      else if (orderCount >= 6 && orderCount <= 10) data[2]++;
      else data[3]++;
    });

    return {
      labels,
      data,
      insights: [
        { label: "Total Customers", value: customerMap.size.toString() },
        { label: "Customers with 1 Order", value: data[0].toString() },
        { label: "Customers with 10+ Orders", value: data[3].toString() },
      ],
    };
  };

  const renderChart = () => {
    if (!reportData) return null;

    switch (selectedReport) {
      case "orders":
        return (
          <Line
            data={{
              labels: reportData.labels,
              datasets: [
                {
                  label: "Order Total",
                  data: reportData.data,
                  borderColor: "rgba(75, 192, 192, 1)",
                  tension: 0.1,
                },
              ],
            }}
          />
        );
      case "products":
        return (
          <Bar
            data={{
              labels: reportData.labels,
              datasets: [
                {
                  label: "Sales",
                  data: reportData.data,
                  backgroundColor: "rgba(153, 102, 255, 0.6)",
                },
              ],
            }}
          />
        );
      case "categories":
        return (
          <Pie
            data={{
              labels: reportData.labels,
              datasets: [
                {
                  data: reportData.data,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                  ],
                },
              ],
            }}
          />
        );
      case "customers":
        return (
          <Bar
            data={{
              labels: reportData.labels,
              datasets: [
                {
                  label: "Number of Customers",
                  data: reportData.data,
                  backgroundColor: "rgba(255, 159, 64, 0.6)",
                },
              ],
            }}
          />
        );

      default:
        return null;
    }
  };

  const generatePDFReport = () => {
    if (!reportData) return;

    const doc = new jsPDF();

    // Add company logo
    const logo = new Image();
    logo.src = "/assets/logo.png";
    doc.addImage(logo, "PNG", 14, 10, 30, 30);

    // Add company name and date
    doc.setFontSize(20);
    doc.text("Trinity Waterproofing", 50, 25);
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString(), 14, 45);

    // Rest of the report content starting lower on the page
    doc.text(
      `${
        selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)
      } Report`,
      14,
      60
    );

    // Adding chart to PDF
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 14, 75, 180, 100);
    }

    // Adding details
    doc.text("Report Details:", 14, 185);
    doc.text(
      `Report Type: ${
        selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)
      }`,
      14,
      195
    );
    doc.text(
      `Selected Date: ${
        selectedDate ? selectedDate.toLocaleDateString() : "Not selected"
      }`,
      14,
      205
    );

    // Adding key insights
    doc.text("Key Insights:", 14, 215);
    doc.autoTable({
      head: [["Insight", "Value"]],
      body: reportData.insights.map((insight) => [
        insight.label,
        insight.value,
      ]),
      startY: 220,
    });

    // Save PDF
    doc.save(`${selectedReport}_report.pdf`);
    toast.success("Report downloaded successfully!");
  };

  const handleDownload = () => {
    generatePDFReport();
  };

  return (
    <div>
      <div className="flex bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                      <Select
                        value={selectedReport}
                        onValueChange={setSelectedReport}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orders">Orders Report</SelectItem>
                          <SelectItem value="products">
                            Products Report
                          </SelectItem>
                          <SelectItem value="categories">
                            Categories Report
                          </SelectItem>
                          <SelectItem value="customers">
                            Customers Report
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="Select Date"
                        className="w-48 p-2 rounded-md"
                      />

                      <Button
                        variant="secondary"
                        onClick={handleDownload}
                        disabled={!reportData}
                      >
                        <FaDownload className="mr-2" /> Download Report
                      </Button>
                      <Link to="/admin/generate-report">
                        <Button variant="outline">
                          <FaFileAlt className="mr-2" /> Generate Custom Report
                        </Button>
                      </Link>
                    </div>
                    <div className="h-[400px]">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <p>Loading...</p>
                        </div>
                      ) : (
                        renderChart()
                      )}
                    </div>
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
                            selectedReport.slice(1)}
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
                          {reportData?.insights.map((insight, index) => (
                            <li
                              key={index}
                            >{`${insight.label}: ${insight.value}`}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Reports;
