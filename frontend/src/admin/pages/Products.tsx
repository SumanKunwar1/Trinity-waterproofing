import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Table from "../components/ui/table";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface Product {
  _id: string;
  name: string;
  brand: string;
  retailPrice: number;
  wholeSalePrice: number;
  instock: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`/api/product/${productToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Brand", accessor: "brand" },
    {
      header: "Retail Price",
      accessor: "retailPrice",
      cell: (row: Product) => `$${row.retailPrice.toFixed(2)}`,
    },
    {
      header: "Wholesale Price",
      accessor: "wholeSalePrice",
      cell: (row: Product) => `$${row.wholeSalePrice.toFixed(2)}`,
    },
    { header: "Stock", accessor: "instock" },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: Product) => (
        <div className="flex space-x-2">
          <Link to={`/admin/add-product/${row._id}`}>
            <Button variant="outline" size="sm">
              <FaEdit className="mr-2" /> Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row._id)}
          >
            <FaTrash className="mr-2" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={toggleSidebar} />
          <div className="container mx-auto p-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">Products</CardTitle>
                  <Link to="/admin/add-product">
                    <Button variant="secondary">Add New Product</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <Table columns={columns} data={products} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
