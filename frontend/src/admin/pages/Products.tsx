import React, { useState, useEffect, useCallback } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
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
import { Switch } from "../components/ui/switch";

interface Color {
  name: string;
  hex: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface IProduct {
  _id: string;
  name: string;
  description: string;
  retailPrice: number;
  wholeSalePrice: number;
  brand: Brand;
  colors: Color[];
  inStock: number;
  productImage: string;
  image: string[];
  features: string;
  pdfUrl: string;
  isFeatured: boolean;
  createdAt: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isUpdating, setIsUpdating] = useState<{ [key: string]: boolean }>({});

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data: IProduct[] = await response.json();
      const sortedProducts = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProducts(sortedProducts);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching products"
      );
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
          throw new Error("Failed to delete product");
        }
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the product"
        );
      }
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleViewDetails = (product: IProduct) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleToggleFeatured = async (
    productId: string,
    currentFeaturedState: boolean
  ) => {
    if (isUpdating[productId]) return;

    // Mark the product as being updated
    setIsUpdating((prev) => ({ ...prev, [productId]: true }));

    try {
      const response = await fetch(`/api/product/isFeatured/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ isFeatured: !currentFeaturedState }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update featured status");
      }

      const updatedProduct: IProduct = await response.json();

      // Update the product list with the new `isFeatured` state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: updatedProduct.isFeatured }
            : product
        )
      );

      // Show success message based on the updated state
      toast.success(`Product featured status updated  successfully`);
    } catch (error: any) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while updating featured status"
      );
    } finally {
      // Clear the updating state for this product
      setIsUpdating((prev) => ({ ...prev, [productId]: false }));
    }
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
      cell: (row: IProduct) => `Rs ${row.retailPrice.toFixed(2)}`,
    },
    {
      header: "Wholesale Price",
      accessor: "wholeSalePrice",
      cell: (row: IProduct) => `Rs ${row.wholeSalePrice.toFixed(2)}`,
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
      header: "Featured",
      accessor: "isFeatured",
      cell: (row: IProduct) => (
        <Switch
          id={`featured-${row._id}`}
          checked={row.isFeatured}
          onCheckedChange={() => handleToggleFeatured(row._id, row.isFeatured)}
          disabled={isUpdating[row._id]}
        />
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: IProduct) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 "
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewDetails(row)}>
              <FaEye className="mr-2" /> View
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/admin/add-product/${row._id}`}>
                <FaEdit className="mr-2" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/admin/edit-product-images/${row._id}`}>
                <FaImage className="mr-2" /> Edit Images
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row._id)}>
              <FaTrash className="mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                <Table columns={columns} data={products} itemsPerPage={10} />
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
              <strong>Retail Price:</strong>
              {" Rs " + selectedProduct?.retailPrice.toFixed(2)}
            </p>
            <p>
              <strong>Wholesale Price:</strong>
              {" Rs " + selectedProduct?.wholeSalePrice.toFixed(2)}
            </p>
            <p>
              <strong>PDF URL:</strong>
              {selectedProduct?.pdfUrl || " No PDF available"}
            </p>
            <p>
              <strong>In Stock:</strong> {selectedProduct?.inStock}
            </p>
            <div>
              <strong>Colors:</strong>
              <div className="flex gap-2 mt-2">
                {!selectedProduct?.colors ||
                selectedProduct.colors.length === 0 ? (
                  <p>No colors for this product</p>
                ) : (
                  selectedProduct.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div>
              <strong>Product Thumbnail: </strong>
              <img
                src={selectedProduct?.productImage || "/placeholder.svg"}
                alt={selectedProduct?.name}
                className="w-24 h-24 object-cover"
              />
            </div>
            <div className="mt-2">
              <strong>Images:</strong>
              <div className="flex gap-2 mt-2">
                {(selectedProduct?.image || []).map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="w-24 h-24 object-cover"
                  />
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
