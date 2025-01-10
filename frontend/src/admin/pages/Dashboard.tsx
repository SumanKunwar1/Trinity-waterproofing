import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
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
import {
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave,
  FaBoxOpen,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LatestOrderTable from "../components/LatestOrderTable";
import { AppDispatch, RootState } from "../store/store";
import { fetchOrdersAsync } from "../store/ordersSlice";
import { toast } from "react-toastify";
import axios from "axios";

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

interface IProduct {
  _id: string;
  name: string;
  price: number;
  createdAt: string;
}

interface IOrder {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
  };
  products: IProduct[];
  subtotal: number;
  status: string;
  createdAt: string;
}

interface IUser {
  _id: string;
  fullName: string;
  createdAt: string;
}

interface ICategory {
  _id: string;
  name: string;
  subCategories: {
    products: any[];
  }[];
}

// Function to generate dynamic colors
const generateColors = (count: number) => {
  const baseColors = [
    { h: 0, s: 70, l: 60 }, // Red
    { h: 210, s: 70, l: 60 }, // Blue
    { h: 60, s: 70, l: 60 }, // Yellow
    { h: 120, s: 70, l: 60 }, // Green
    { h: 280, s: 70, l: 60 }, // Purple
    { h: 30, s: 70, l: 60 }, // Orange
  ];

  const colors = [];
  for (let i = 0; i < count; i++) {
    const baseColor = baseColors[i % baseColors.length];
    // Adjust lightness slightly for variety when we need more colors than base colors
    const lightness = baseColor.l + Math.floor(i / baseColors.length) * 10;
    colors.push(`hsla(${baseColor.h}, ${baseColor.s}%, ${lightness}%, 0.6)`);
  }
  return colors;
};

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrdersAsync());
    fetchProducts();
    fetchUsers();
    fetchCategories();
  }, [dispatch]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");
      setCategories(response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch categories";
      toast.error(errorMessage);
    }
  };
  console.log("Categories:", categories);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const filterDataByMonth = <T extends { createdAt: string }>(
    data: T[],
    monthsAgo: number
  ): T[] => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - monthsAgo);
    targetDate.setDate(1); // Start of the month
    const nextMonth = new Date(targetDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return data.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= targetDate && itemDate < nextMonth;
    });
  };

  const currentMonthOrders = filterDataByMonth(orders, 0);
  const prevMonthOrders = filterDataByMonth(orders, 1);
  const currentMonthProducts = filterDataByMonth(products, 0);
  const prevMonthProducts = filterDataByMonth(products, 1);
  const currentMonthUsers = filterDataByMonth(users, 0);
  const prevMonthUsers = filterDataByMonth(users, 1);

  const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const prevTotalRevenue = prevMonthOrders.reduce(
    (sum, order) => sum + order.subtotal,
    0
  );
  const revenueChange = calculatePercentageChange(
    totalRevenue,
    prevTotalRevenue
  );

  const totalOrders = orders.length;
  const prevTotalOrders = prevMonthOrders.length;
  const ordersChange = calculatePercentageChange(totalOrders, prevTotalOrders);

  const totalProducts = products.length;
  const prevTotalProducts = prevMonthProducts.length;
  const productsChange = calculatePercentageChange(
    totalProducts,
    prevTotalProducts
  );

  const totalCustomers = users.length;
  const prevTotalCustomers = prevMonthUsers.length;
  const customersChange = calculatePercentageChange(
    totalCustomers,
    prevTotalCustomers
  );

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: orders
          .filter(
            (order) =>
              new Date(order.createdAt).getFullYear() ===
              new Date().getFullYear()
          )
          .reduce((acc, order) => {
            const month = new Date(order.createdAt).getMonth();
            acc[month] = (acc[month] || 0) + order.subtotal;
            return acc;
          }, Array(6).fill(0)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const ordersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Orders",
        data: orders
          .filter(
            (order) =>
              new Date(order.createdAt).getFullYear() ===
              new Date().getFullYear()
          )
          .reduce((acc, order) => {
            const month = new Date(order.createdAt).getMonth();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, Array(6).fill(0)),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const categoryData = {
    labels: categories.map((category) => category.name),
    datasets: [
      {
        data: categories.map((category) => {
          const subCategoryProducts = category.subCategories.reduce(
            (total, subCategory) => total + subCategory.products.length,
            0
          );
          return subCategoryProducts;
        }),
        backgroundColor: generateColors(categories.length),
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <FaMoneyBillWave className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rs {totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {revenueChange > 0 ? "+" : ""}
                    {revenueChange.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-tertiary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Customers
                  </CardTitle>
                  <FaUsers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    {customersChange > 0 ? "+" : ""}
                    {customersChange.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-button">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <FaShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {ordersChange > 0 ? "+" : ""}
                    {ordersChange.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-[#75dede]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <FaBoxOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {productsChange > 0 ? "+" : ""}
                    {productsChange.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar data={salesData} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line data={ordersData} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Latest Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <LatestOrderTable orders={orders.slice(0, 10)} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Products by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Pie data={categoryData} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
