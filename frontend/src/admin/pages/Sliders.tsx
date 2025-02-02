import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Table from "../components/ui/table";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface Slider {
  _id: string;
  title: string;
  description: string;
  media: {
    type: "image" | "video";
    url: string;
  };
  isvisible: boolean;
}

interface FormData {
  title: string;
  description: string;
  mediaType: "image" | "video";
  mediaFile: File | null;
  isvisible: boolean;
}

const Sliders: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingSlider, setViewingSlider] = useState<Slider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    mediaType: "image",
    mediaFile: null,
    isvisible: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    if (editingSlider) {
      setFormData({
        title: editingSlider.title,
        description: editingSlider.description,
        mediaType: editingSlider.media.type,
        mediaFile: null,
        isvisible: editingSlider.isvisible,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        mediaType: "image",
        mediaFile: null,
        isvisible: false,
      });
    }
  }, [editingSlider]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // if (!formData.title.trim()) {
    //   newErrors.title = "Title is required";
    // }
    // if (!formData.description.trim()) {
    //   newErrors.description = "Description is required";
    // }
    if (!editingSlider && !formData.mediaFile) {
      newErrors.mediaFile = "Media file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/slider", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch sliders");
      }
      const data = await response.json();
      setSliders(data);
    } catch (error: any) {
      toast.info(error.message || "No sliders available at the moment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaTypeChange = (value: "image" | "video") => {
    setFormData((prev) => ({ ...prev, mediaType: value, mediaFile: null }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, mediaFile: file }));
  };

  const handleVisibilityChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isvisible: checked }));

    // Show message based on visibility
    if (checked) {
      toast.success("Slider visibility is ON");
    } else {
      toast.success("Slider visibility is OFF");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("isvisible", formData.isvisible.toString());

    if (formData.mediaFile) {
      formDataToSend.append(formData.mediaType, formData.mediaFile);
    }

    try {
      const url = editingSlider
        ? `/api/slider/${editingSlider._id}`
        : "/api/slider";
      const method = editingSlider ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save slider");
      }

      toast.success(
        editingSlider
          ? "Slider updated successfully"
          : "Slider added successfully"
      );
      fetchSliders();
      setEditingSlider(null);
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        mediaType: "image",
        mediaFile: null,
        isvisible: false,
      });
    } catch (error: any) {
      console.error(error.message || "Error saving slider:", error);
      toast.error("Failed to save slider");
    }
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setIsDialogOpen(true);
  };

  const handleView = (slider: Slider) => {
    setViewingSlider(slider);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete slider");
      }

      toast.success("Slider deleted successfully");
      fetchSliders();
    } catch (error: any) {
      console.error(error.message || "Error deleting slider");
      toast.error("Failed to delete slider");
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("isvisible", (!currentVisibility).toString());

      const response = await fetch(`/api/slider/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle visibility");
      }

      // Display the success message based on visibility state
      const newVisibility = !currentVisibility;
      if (newVisibility) {
        toast.success("Slider visibility is ON");
      } else {
        toast.success("Slider visibility is OFF");
      }

      fetchSliders(); // Refresh the list of sliders
    } catch (error: any) {
      console.error(error.message || "Error toggling visibility");
      toast.error("Failed to toggle visibility");
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    {
      header: "Media",
      accessor: "media",
      cell: (row: Slider) =>
        row.media.type === "image" ? (
          <img
            src={row.media.url}
            alt={row.title}
            className="w-16 h-16 object-cover"
          />
        ) : (
          <video
            src={row.media.url}
            className="w-16 h-16 object-cover"
            controls
          />
        ),
    },
    {
      header: "Visibility",
      accessor: "isvisible",
      cell: (row: Slider) => (
        <Switch
          checked={row.isvisible}
          onCheckedChange={() => handleToggleVisibility(row._id, row.isvisible)}
        />
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: Slider) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <FaEllipsisV className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row)}>
              <FaEye className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row)}>
              <FaEdit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row._id)}>
              <FaTrash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                        variant="default"
                        onClick={() => setEditingSlider(null)}
                      >
                        Add New Slider
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogTitle>
                        {editingSlider ? "Edit Slider" : "Add New Slider"}
                      </DialogTitle>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                          />
                          {errors.title && (
                            <p className="text-red-500 text-sm">
                              {errors.title}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                          {errors.description && (
                            <p className="text-red-500 text-sm">
                              {errors.description}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Media Type</Label>
                          <Select
                            value={formData.mediaType}
                            onValueChange={handleMediaTypeChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mediaFile">
                            Upload {formData.mediaType}
                          </Label>
                          <Input
                            id="mediaFile"
                            type="file"
                            accept={
                              formData.mediaType === "image"
                                ? "image/*"
                                : "video/*"
                            }
                            onChange={handleFileChange}
                          />
                          {errors.mediaFile && (
                            <p className="text-red-500 text-sm">
                              {errors.mediaFile}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isvisible"
                            checked={formData.isvisible}
                            onCheckedChange={handleVisibilityChange}
                          />
                          <Label htmlFor="isvisible">Visible</Label>
                        </div>

                        <Button type="submit" className="w-full">
                          {editingSlider ? "Update Slider" : "Add Slider"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <Table data={sliders} columns={columns} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Slider Details</DialogTitle>
          {viewingSlider && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <p>{viewingSlider.title}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p>{viewingSlider.description}</p>
              </div>
              <div>
                <Label>Media</Label>
                {viewingSlider.media.type === "image" ? (
                  <img
                    src={viewingSlider.media.url}
                    alt={viewingSlider.title}
                    className="w-full h-auto"
                  />
                ) : (
                  <video
                    src={viewingSlider.media.url}
                    controls
                    className="w-full h-auto"
                  />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="view-isvisible"
                  checked={viewingSlider.isvisible}
                  onCheckedChange={(checked) =>
                    handleToggleVisibility(viewingSlider._id, !checked)
                  }
                />
                <Label htmlFor="view-isvisible">Visible</Label>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sliders;
