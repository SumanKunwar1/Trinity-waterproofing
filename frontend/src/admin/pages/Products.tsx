import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaEye, FaImage } from "react-icons/fa";
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
import { IProduct } from "../../types/product";

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        // Parse the error response to get the API's structured error
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch products"); // Use API error message if available
      }
      const data = await response.json();
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(`/api/product/${productToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          // Parse the error response to get the API's structured error
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete product"); // Use API error message if available
        }
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleViewDetails = (product: IProduct, e?: React.MouseEvent) => {
    // Prevent event bubbling if event exists
    if (e) {
      e.stopPropagation();
    }
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    {
      header: "Brand",
      accessor: "brand.name",
      cell: (row: IProduct) => row.brand?.name || "No Brand",
    },
    {
      header: "Retail Price",
      accessor: "retailPrice",
      cell: (row: IProduct) => `$${row.retailPrice.toFixed(2)}`,
    },
    {
      header: "Wholesale Price",
      accessor: "wholeSalePrice",
      cell: (row: IProduct) => `$${row.wholeSalePrice.toFixed(2)}`,
    },
    { header: "Stock", accessor: "inStock" },
    {
      header: "Colors",
      accessor: "colors",
      cell: (row: IProduct) => (
        <div className="flex gap-1">
          {row.colors?.length ? (
            row.colors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))
          ) : (
            <span>No Colors</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: IProduct) => (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleViewDetails(row, e)}
          >
            <FaEye className="mr-2" /> View
          </Button>
          <Link to={`/admin/add-product/${row._id}`}>
            <Button variant="outline" size="sm">
              <FaEdit className="mr-2" /> Edit
            </Button>
          </Link>
          <Link to={`/admin/edit-product-images/${row._id}`}>
            <Button variant="outline" size="sm">
              <FaImage className="mr-2" /> Edit Images
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
                <Table
                  columns={columns}
                  data={products}
                  onRowClick={(item: IProduct) => handleViewDetails(item)}
                  itemsPerPage={10}
                />
              </CardContent>
            </Card>
          </motion.div>
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
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <strong>Description:</strong> {selectedProduct?.description}
            </p>
            <p>
              <strong>Brand:</strong> {selectedProduct?.brand.name}
            </p>
            <p>
              <strong>Retail Price:</strong> $
              {selectedProduct?.retailPrice.toFixed(2)}
            </p>
            <p>
              <strong>Wholesale Price:</strong> $
              {selectedProduct?.wholeSalePrice.toFixed(2)}
            </p>
            <p>
              <strong>In Stock:</strong> {selectedProduct?.inStock}
            </p>
            <div>
              <strong>Colors:</strong>
              <div className="flex gap-2 mt-2">
                {selectedProduct?.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <strong>Features:</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedProduct?.features || "",
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
