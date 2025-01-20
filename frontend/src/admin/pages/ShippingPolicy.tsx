import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { MoreVertical, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Define the Policy interface
interface IPolicy {
  _id: string;
  title: string;
  description: string;
  updatedAt: string;
}

// Validation schema
const shippingPolicySchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

const ShippingPolicy = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [policies, setPolicies] = useState<IPolicy[]>([]); // Specify the type of policies as IPolicy[]
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<IPolicy | null>(null); // Update type to IPolicy or null
  const authToken = localStorage.getItem("authToken");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shippingPolicySchema),
  });

  const fetchPolicies = async () => {
    try {
      const response = await fetch("/api/shipping-policy", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch policies");
      }

      const data = await response.json();
      setPolicies(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch policies");
      setPolicies([]);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const onSubmit = async (formData: any) => {
    const requestBody = JSON.stringify(formData);
    const url = editingPolicy
      ? `/api/shipping-policy/${editingPolicy._id}`
      : "/api/shipping-policy";

    try {
      const response = await fetch(url, {
        method: editingPolicy ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update policy");
      }

      const successMessage = editingPolicy
        ? "Policy updated successfully"
        : "Policy created successfully";

      toast.success(successMessage);
      setIsDialogOpen(false);
      setEditingPolicy(null);
      reset();
      fetchPolicies();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/shipping-policy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete policy");
      }

      toast.success("Policy deleted successfully");
      fetchPolicies();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete policy");
    }
  };

  const handleEdit = (policy: IPolicy) => {
    setEditingPolicy(policy);
    setValue("title", policy.title);
    setValue("description", policy.description);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPolicy(null);
    reset();
    setIsDialogOpen(true);
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex bg-gray-100">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Shipping Policies</h1>
              <Button
                onClick={handleCreateNew}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add New Policy
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policies.length > 0 ? (
                policies.map((policy: IPolicy) => (
                  <motion.div
                    key={policy._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold">
                          {policy.title}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(policy)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(policy._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{policy.description}</p>
                        <div className="mt-4 text-sm text-gray-500">
                          Last updated:{" "}
                          {new Date(policy.updatedAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">No policies found.</p>
              )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingPolicy ? "Edit Policy" : "Create New Policy"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      className={errors.description ? "border-red-500" : ""}
                      rows={5}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingPolicy ? "Update Policy" : "Create Policy"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
