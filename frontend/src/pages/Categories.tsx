import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
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

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  description: string;
}

const categorySchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const subcategorySchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  categoryId: Yup.number().required("Required"),
  description: Yup.string().required("Required"),
});

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Paints",
      description: "Various types of waterproof paints",
    },
    {
      id: 2,
      name: "Sealants",
      description: "Waterproof sealants for different applications",
    },
  ]);

  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    {
      id: 1,
      categoryId: 1,
      name: "Exterior Paints",
      description: "Waterproof paints for exterior use",
    },
    {
      id: 2,
      categoryId: 1,
      name: "Interior Paints",
      description: "Waterproof paints for interior use",
    },
    {
      id: 3,
      categoryId: 2,
      name: "Silicone Sealants",
      description: "Silicone-based waterproof sealants",
    },
  ]);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);

  const handleCategorySubmit = (
    values: Omit<Category, "id">,
    { resetForm }: any
  ) => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...values, id: editingCategory.id }
            : c
        )
      );
      toast.success("Category updated successfully");
    } else {
      setCategories([...categories, { ...values, id: categories.length + 1 }]);
      toast.success("Category added successfully");
    }
    setEditingCategory(null);
    setIsCategoryDialogOpen(false);
    resetForm();
  };

  const handleSubcategorySubmit = (
    values: Omit<Subcategory, "id">,
    { resetForm }: any
  ) => {
    if (editingSubcategory) {
      setSubcategories(
        subcategories.map((s) =>
          s.id === editingSubcategory.id
            ? { ...values, id: editingSubcategory.id }
            : s
        )
      );
      toast.success("Subcategory updated successfully");
    } else {
      setSubcategories([
        ...subcategories,
        { ...values, id: subcategories.length + 1 },
      ]);
      toast.success("Subcategory added successfully");
    }
    setEditingSubcategory(null);
    setIsSubcategoryDialogOpen(false);
    resetForm();
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
    setSubcategories(subcategories.filter((s) => s.categoryId !== id));
    toast.success("Category and associated subcategories deleted successfully");
  };

  const handleDeleteSubcategory = (id: number) => {
    setSubcategories(subcategories.filter((s) => s.id !== id));
    toast.success("Subcategory deleted successfully");
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
            <CardTitle className="text-2xl font-bold">
              Categories and Subcategories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="categories">
              <TabsList>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
              </TabsList>
              <TabsContent value="categories">
                <div className="flex justify-end mb-4">
                  <Dialog
                    open={isCategoryDialogOpen}
                    onOpenChange={setIsCategoryDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingCategory(null)}>
                        <FaPlus className="mr-2" /> Add New Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>
                        {editingCategory ? "Edit Category" : "Add New Category"}
                      </DialogTitle>
                      <FormikForm
                        initialValues={
                          editingCategory || { name: "", description: "" }
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
                          editingCategory ? "Update Category" : "Add Category"
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
                          onClick={() => setEditingCategory(category)}
                        >
                          <FaEdit className="mr-2" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
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
                      <Button onClick={() => setEditingSubcategory(null)}>
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
                              value: c.id.toString(),
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
                      (c) => c.id === subcategory.categoryId
                    )?.name,
                    actions: (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSubcategory(subcategory)}
                        >
                          <FaEdit className="mr-2" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteSubcategory(subcategory.id)
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
  );
};

export default Categories;
