import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
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
import { Switch } from "../components/ui/switch";
import FormikForm from "../components/FormikForm"; // Reusable form component
import Table from "../components/ui/table"; // Reusable table component
import * as Yup from "yup";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface Slider {
  id: number;
  title: string;
  image: string;
  link: string;
  isVisible: boolean;
}

const sliderSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  image: Yup.string().url("Invalid URL").required("Required"),
  link: Yup.string().url("Invalid URL").required("Required"),
  isVisible: Yup.boolean(),
});

const Sliders: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const [sliders, setSliders] = useState<Slider[]>([
    {
      id: 1,
      title: "Summer Sale",
      image: "/summer-sale.jpg",
      link: "/sale",
      isVisible: true,
    },
    {
      id: 2,
      title: "New Products",
      image: "/new-products.jpg",
      link: "/new",
      isVisible: false,
    },
  ]);

  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "image", label: "Image URL", type: "text" },
    { name: "link", label: "Link", type: "text" },
    { name: "isVisible", label: "Visible", type: "switch" },
  ];

  const handleSubmit = (values: Omit<Slider, "id">, { resetForm }: any) => {
    if (editingSlider) {
      setSliders(
        sliders.map((s) =>
          s.id === editingSlider.id ? { ...values, id: editingSlider.id } : s
        )
      );
      toast.success("Slider updated successfully");
    } else {
      setSliders([...sliders, { ...values, id: sliders.length + 1 }]);
      toast.success("Slider added successfully");
    }
    setEditingSlider(null);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSliders(sliders.filter((s) => s.id !== id));
    toast.success("Slider deleted successfully");
  };

  const handleToggleVisibility = (id: number) => {
    setSliders(
      sliders.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s))
    );
    toast.success(`Slider visibility toggled`);
  };

  const columns = [
    { header: "Title", accessor: "title" },
    {
      header: "Image",
      accessor: "image",
      cell: (row: Slider) => (
        <img
          src={row.image}
          alt={row.title}
          className="w-16 h-16 object-cover"
        />
      ),
    },
    { header: "Link", accessor: "link" },
    {
      header: "Visibility",
      accessor: "isVisible",
      cell: (row: Slider) => (
        <Switch
          id={`visibility-${row.id}`}
          checked={row.isVisible}
          onCheckedChange={() => handleToggleVisibility(row.id)}
        />
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: Slider) => (
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

  return (
    <div>
      <div className="flex bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">Sliders</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingSlider(null)}
                      >
                        Add New Slider
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogTitle>
                        {editingSlider ? "Edit Slider" : "Add New Slider"}
                      </DialogTitle>
                      <FormikForm
                        initialValues={
                          editingSlider || {
                            title: "",
                            image: "",
                            link: "",
                            isVisible: false,
                          }
                        }
                        validationSchema={sliderSchema}
                        onSubmit={handleSubmit}
                        fields={formFields}
                        submitButtonText={
                          editingSlider ? "Update Slider" : "Add Slider"
                        }
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table data={sliders} columns={columns} />
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Sliders;
