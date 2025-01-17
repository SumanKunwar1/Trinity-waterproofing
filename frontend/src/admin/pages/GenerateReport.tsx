import { useState } from "react";
import { toast } from "react-toastify";
import { FaFileAlt } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button } from "../components/ui/button";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  fetchOrders,
  fetchProducts,
  fetchCategories,
  fetchUsers,
} from "../utils/api";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface OrderData {
  id: string;
  products: string;
  userId: string;
  address: string;
  subtotal: number;
  status: string;
  createdAt: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  retailPrice: number;
  wholeSalePrice: number;
  productImage: string;
  images: string;
  features: string;
  brand: string;
  inStock: number;
  subCategory: string;
  createdAt: string;
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  subCategory: string;
  products: string;
  createdAt: string;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  number: string;
  role: string;
  address: string;
  createdAt: string;
}

const GenerateReport: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [reportType, setReportType] = useState<string>("orders");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [fileFormat, setFileFormat] = useState<string>("pdf");
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = window.location.origin;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const fetchReportData = async (
    type: string,
    startDate: Date | null,
    endDate: Date | null
  ): Promise<OrderData[] | ProductData[] | CategoryData[] | UserData[]> => {
    if (
      !startDate ||
      (!endDate &&
        type !== "users" &&
        type !== "products" &&
        type !== "categories")
    ) {
      throw new Error("Invalid date range");
    }

    try {
      let data;
      switch (type) {
        case "orders":
          data = await fetchOrders();
          console.log("Order data:", data);
          return data.map((order: any) => ({
            id: order._id,
            products: order.products
              .map((p: any) =>
                p.productId
                  ? `${p.productId.name} (${p.quantity}) ${
                      p.color ? `(${p.color})` : ""
                    } - $${p.price}`
                  : `Custom Product (${p.quantity}) ${
                      p.color ? `(${p.color})` : ""
                    } - $${p.price}`
              )
              .join(", "),
            userId: order.userId.fullName,
            address: [
              order.address.street,
              order.address.city,
              order.address.province,
              order.address.district,
              order.address.postalCode,
              order.address.country,
            ]
              .filter(Boolean)
              .join(", "),
            subtotal: order.subtotal,
            status: order.status,
            createdAt: new Date(order.createdAt).toLocaleDateString(),
          }));
        case "products":
          data = await fetchProducts();
          return data.map((product: any) => ({
            id: product._id,
            name: product.name,
            description: product.description,
            retailPrice: product.retailPrice,
            wholeSalePrice: product.wholeSalePrice,
            productImage: baseURL + product.productImage,
            images: product.image
              .map((img: string) => baseURL + img)
              .join(", "),
            features: Array.isArray(product.features)
              ? product.features
                  .map((feature: string) =>
                    feature.replace(/<[^>]*>/g, "").replace(/\n/g, "")
                  )
                  .join(", ")
              : product.features.replace(/<[^>]*>/g, "").replace(/\n/g, ""),
            brand: product.brand._id,
            inStock: product.inStock,
            subCategory: product.subCategory.name,
            createdAt: new Date(product.createdAt).toLocaleDateString(),
          }));

        case "categories":
          data = await fetchCategories();
          return data.map((category: any) => ({
            id: category._id,
            name: category.name,
            description: category.description,
            subCategory: category.subCategories
              .map((subCat: any) => subCat.name)
              .join(", "),
            products: category.subCategories
              .map((subCat: any) =>
                subCat.products.map((product: any) => product.name).join(", ")
              )
              .join(", "),
            createdAt: new Date(category.createdAt).toLocaleDateString(),
          }));

        case "users":
          data = await fetchUsers();
          console.log("Users data:", data);
          return data.map((user: any) => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            number: user.number,
            role: user.role,
            address:
              user.addressBook && user.addressBook.length > 0
                ? [
                    user.addressBook[0].street,
                    user.addressBook[0].city,
                    user.addressBook[0].province,
                    user.addressBook[0].district,
                    user.addressBook[0].postalCode,
                    user.addressBook[0].country,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : "No address provided",
            createdAt: new Date(user.createdAt).toLocaleDateString(),
          }));

        default:
          throw new Error("Invalid report type");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      throw new Error("Failed to fetch report data.");
    }
  };

  const generatePDF = (
    data: OrderData[] | ProductData[] | CategoryData[] | UserData[]
  ) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;

    // Add the company logo
    const logoUrl = "/assets/logo.png";
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = margin;

    doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);

    // Add company name
    const companyName = "Trinity Waterproofing";
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const companyNameWidth = doc.getTextWidth(companyName);
    const companyNameX = (pageWidth - companyNameWidth) / 2;
    doc.text(companyName, companyNameX, logoY + logoHeight + 5);

    // Title of the report
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      margin,
      margin + 30
    );

    // Add date range if available
    doc.setFontSize(10);
    if (dateRange.from && dateRange.to) {
      doc.text(
        `Date Range: ${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}`,
        margin,
        margin + 40
      );
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((item) => Object.values(item));

    const tableWidth = pageWidth - 2 * margin;
    const columnWidth = tableWidth / headers.length;

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: margin + 50,
      margin: { left: margin, right: margin },
      columnStyles: headers.reduce((acc: any, _, index) => {
        acc[index] = {
          cellWidth: columnWidth,
          overflow: "linebreak",
        };
        return acc;
      }, {}),
      styles: {
        overflow: "linebreak",
        cellPadding: 2,
        fontSize: 8,
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: { fillColor: [242, 242, 242] },
      bodyStyles: { valign: "middle" },
      theme: "grid",
      tableWidth: "auto",
      didDrawPage: (data: any) => {
        doc.setFontSize(8);
        doc.text(
          `Page ${data.pageNumber} of ${data.pageCount}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: "center" }
        );
      },
    });

    doc.save(`${reportType}_report.pdf`);
  };

  const generateCSV = (
    data: OrderData[] | ProductData[] | CategoryData[] | UserData[]
  ) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}_report.csv`);
  };

  const generateExcel = (
    data: OrderData[] | ProductData[] | CategoryData[] | UserData[]
  ) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
  };

  const handleGenerateReport = async () => {
    if (
      !dateRange.from ||
      (!dateRange.to &&
        reportType !== "users" &&
        reportType !== "products" &&
        reportType !== "categories")
    ) {
      toast.error("Please select a valid date range");
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchReportData(
        reportType,
        dateRange.from,
        dateRange.to
      );

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
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
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
                    <option value="users">Users Report</option>
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
                        dateRange.from
                          ? dateRange.from.toISOString().split("T")[0]
                          : ""
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
                        dateRange.to
                          ? dateRange.to.toISOString().split("T")[0]
                          : ""
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
                  disabled={isLoading}
                >
                  <FaFileAlt className="mr-2" />
                  {isLoading ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
