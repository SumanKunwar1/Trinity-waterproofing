import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import FormikForm from "../components/FormikForm";
import Table from "../components/ui/table";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface Category {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Subcategory {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  created_at: string;
  updated_at: string;
}

const categorySchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const subcategorySchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  categoryId: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const getAuthToken = () => localStorage.getItem("authToken");

const Categories: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] =
    useState(false);
  const [isDeleteSubcategoryDialogOpen, setIsDeleteSubcategoryDialogOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(
    null
  );

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");
      setCategories(response.data);
    } catch (error: any) {
      // Extract error message from the Axios error object
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch categories";
      toast.error(errorMessage);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("/api/subcategory");
      setSubcategories(response.data);
    } catch (error: any) {
      // Extract error message from the Axios error object
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch subcategories";
      toast.error(errorMessage);
    }
  };

  const handleCategorySubmit = async (
    values: Omit<Category, "_id" | "created_at" | "updated_at">,
    { resetForm }: any
  ) => {
    try {
      if (editingCategory) {
        await axios.patch(`/api/category/${editingCategory._id}`, values, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        toast.success("Category updated successfully");
      } else {
        await axios.post("/api/category", values, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        toast.success("Category added successfully");
      }
      fetchCategories();
      setEditingCategory(null);
      setIsCategoryDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to save category";
      toast.error(errorMessage);
    }
  };

  const handleSubcategorySubmit = async (
    values: Omit<Subcategory, "_id" | "created_at" | "updated_at">,
    { resetForm }: any
  ) => {
    try {
      if (editingSubcategory) {
        await axios.patch(
          `/api/subcategory/${editingSubcategory._id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        toast.success("Subcategory updated successfully");
      } else {
        await axios.post("/api/subcategory", values, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        toast.success("Subcategory added successfully");
      }
      fetchSubcategories();
      setEditingSubcategory(null);
      setIsSubcategoryDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to save subcategory";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteCategoryDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await axios.delete(`/api/category/${categoryToDelete}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        toast.success("Category deleted successfully");
        fetchCategories();
        fetchSubcategories();
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to delete category";
        toast.error(errorMessage);
      }
    }
    setIsDeleteCategoryDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteSubcategory = (id: string) => {
    setSubcategoryToDelete(id);
    setIsDeleteSubcategoryDialogOpen(true);
  };

  const confirmDeleteSubcategory = async () => {
    if (subcategoryToDelete) {
      try {
        await axios.delete(`/api/subcategory/${subcategoryToDelete}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        toast.success("Subcategory deleted successfully");
        fetchSubcategories();
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to delete subcategory";
        toast.error(errorMessage);
      }
    }
    setIsDeleteSubcategoryDialogOpen(false);
    setSubcategoryToDelete(null);
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
                      Categories and Subcategories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="categories">
                      <TabsList>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                        <TabsTrigger value="subcategories">
                          SubCategories
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="categories">
                        <div className="flex justify-end mb-4">
                          <Dialog
                            open={isCategoryDialogOpen}
                            onOpenChange={setIsCategoryDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="secondary"
                                onClick={() => setEditingCategory(null)}
                              >
                                <FaPlus className="mr-2" /> Add New Category
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle>
                                {editingCategory
                                  ? "Edit Category"
                                  : "Add New Category"}
                              </DialogTitle>
                              <FormikForm
                                initialValues={
                                  editingCategory || {
                                    name: "",
                                    description: "",
                                  }
                                }
                                validationSchema={categorySchema}
                                onSubmit={handleCategorySubmit}
                                fields={[
                                  {
                                    name: "name",
                                    label: "Category Name",
                                    type: "text",
                                  },
                                  {
                                    name: "description",
                                    label: "Description",
                                    type: "textarea",
                                  },
                                ]}
                                submitButtonText={
                                  editingCategory
                                    ? "Update Category"
                                    : "Add Category"
                                }
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Table
                          columns={[
                            { header: "Name", accessor: "name" },
                            { header: "Description", accessor: "description" },
                            { header: "Actions", accessor: "actions" },
                          ]}
                          data={categories.map((category) => ({
                            ...category,
                            actions: (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCategory(category);
                                    setIsCategoryDialogOpen(true);
                                  }}
                                >
                                  <FaEdit className="mr-2" /> Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteCategory(category._id)
                                  }
                                >
                                  <FaTrash className="mr-2" /> Delete
                                </Button>
                              </div>
                            ),
                          }))}
                          itemsPerPage={5}
                        />
                      </TabsContent>

                      <TabsContent value="subcategories">
                        <div className="flex justify-end mb-4">
                          <Dialog
                            open={isSubcategoryDialogOpen}
                            onOpenChange={setIsSubcategoryDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="secondary"
                                onClick={() => setEditingSubcategory(null)}
                              >
                                <FaPlus className="mr-2" /> Add New Subcategory
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle>
                                {editingSubcategory
                                  ? "Edit Subcategory"
                                  : "Add New Subcategory"}
                              </DialogTitle>
                              <FormikForm
                                initialValues={
                                  editingSubcategory || {
                                    name: "",
                                    categoryId: "",
                                    description: "",
                                  }
                                }
                                validationSchema={subcategorySchema}
                                onSubmit={handleSubcategorySubmit}
                                fields={[
                                  {
                                    name: "name",
                                    label: "Subcategory Name",
                                    type: "text",
                                  },
                                  {
                                    name: "categoryId",
                                    label: "Category",
                                    type: "select",
                                    options: categories.map((c) => ({
                                      value: c._id,
                                      label: c.name,
                                    })),
                                  },
                                  {
                                    name: "description",
                                    label: "Description",
                                    type: "textarea",
                                  },
                                ]}
                                submitButtonText={
                                  editingSubcategory
                                    ? "Update Subcategory"
                                    : "Add Subcategory"
                                }
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Table
                          columns={[
                            { header: "Name", accessor: "name" },
                            { header: "Category", accessor: "category" },
                            { header: "Description", accessor: "description" },
                            { header: "Actions", accessor: "actions" },
                          ]}
                          data={subcategories.map((subcategory) => ({
                            ...subcategory,
                            category: categories.find(
                              (c) => c._id === subcategory.categoryId
                            )?.name,
                            actions: (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingSubcategory(subcategory);
                                    setIsSubcategoryDialogOpen(true);
                                  }}
                                >
                                  <FaEdit className="mr-2" /> Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteSubcategory(subcategory._id)
                                  }
                                >
                                  <FaTrash className="mr-2" /> Delete
                                </Button>
                              </div>
                            ),
                          }))}
                          itemsPerPage={5}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      <Dialog
        open={isDeleteCategoryDialogOpen}
        onOpenChange={setIsDeleteCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Category Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isDeleteSubcategoryDialogOpen}
        onOpenChange={setIsDeleteSubcategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subcategory Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subcategory? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteSubcategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSubcategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
