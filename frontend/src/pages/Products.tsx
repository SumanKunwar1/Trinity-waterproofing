import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import FormikForm from "../components/FormikForm"; // Your custom form component
import Table from "../components/ui/table"; // Reusable Table Component

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
}

const productSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  subcategory: Yup.string().required("Required"),
  brand: Yup.string().required("Required"),
  price: Yup.number().positive("Must be positive").required("Required"),
  stock: Yup.number()
    .integer("Must be an integer")
    .min(0, "Must be at least 0")
    .required("Required"),
  description: Yup.string().required("Required"),
});

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Waterproof Paint A",
      category: "Paints",
      subcategory: "Exterior",
      brand: "BrandA",
      price: 19.99,
      stock: 100,
      description: "High-quality exterior waterproof paint",
    },
    {
      id: 2,
      name: "Sealant X",
      category: "Sealants",
      subcategory: "Silicone",
      brand: "BrandB",
      price: 29.99,
      stock: 50,
      description: "Professional-grade silicone sealant",
    },
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (values: Omit<Product, "id">, { resetForm }: any) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...values, id: editingProduct.id } : p
        )
      );
      toast.success("Product updated successfully");
    } else {
      setProducts([...products, { ...values, id: products.length + 1 }]);
      toast.success("Product added successfully");
    }
    setEditingProduct(null);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted successfully");
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    { header: "Subcategory", accessor: "subcategory" },
    { header: "Brand", accessor: "brand" },
    {
      header: "Price",
      accessor: "price",
      cell: (row: Product) => `$${row.price.toFixed(2)}`,
    },
    { header: "Stock", accessor: "stock" },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: Product) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>
            <FaEdit className="mr-2" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash className="mr-2" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  const formFields = [
    { name: "name", label: "Product Name", type: "text" },
    { name: "category", label: "Category", type: "text" },
    { name: "subcategory", label: "Subcategory", type: "text" },
    { name: "brand", label: "Brand", type: "text" },
    { name: "price", label: "Price", type: "number" },
    { name: "stock", label: "Stock", type: "number" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Products</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProduct(null)}>
                  Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <FormikForm
                  initialValues={
                    editingProduct || {
                      name: "",
                      category: "",
                      subcategory: "",
                      brand: "",
                      price: 0,
                      stock: 0,
                      description: "",
                    }
                  }
                  validationSchema={productSchema}
                  onSubmit={handleSubmit}
                  fields={formFields}
                  submitButtonText={
                    editingProduct ? "Update Product" : "Add Product"
                  }
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table columns={columns} data={products} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Products;
