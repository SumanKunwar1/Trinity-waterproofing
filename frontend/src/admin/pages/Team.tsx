import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaEllipsisV, FaPlus } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import Table from "../components/ui/table";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface ITeam {
  _id: string;
  name: string;
  role: string;
  image: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

const AdminTeam: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<ITeam[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1); // Added state for totalPages
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<ITeam | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITeam>();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [currentPage]);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/team`);
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }
      const data = await response.json();
      setTeamMembers(data);
      setTotalPages(data.totalPages); // Assuming API provides totalPages
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMember(null);
    reset({});
    setIsFormDialogOpen(true);
  };

  const handleEdit = (member: ITeam) => {
    setEditingMember(member);
    reset(member);
    setIsFormDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }
      toast.success("Team member deleted successfully");
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };

  const onSubmit = async (data: ITeam) => {
    try {
      console.log("Form data before processing:", data);

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (
          key === "_id" ||
          key === "__v" ||
          key === "createdAt" ||
          key === "updatedAt"
        ) {
          // Skip _id field for editing
          return;
        }

        if (key === "image" && value instanceof FileList) {
          // Append the first file if the `image` field is a FileList
          formData.append(key, value[0]);
        } else if (Array.isArray(value)) {
          // Handle array values (stringify them if needed)
          formData.append(key, JSON.stringify(value));
        } else if (value) {
          formData.append(key, value as string);
        }
      });

      console.log("FormData being sent:", Array.from(formData.entries())); // Debug

      const url = editingMember
        ? `/api/team/${editingMember._id}`
        : "/api/team";
      const method = editingMember ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save team member");
      }

      toast.success(
        `Team member ${editingMember ? "updated" : "added"} successfully`
      );
      setIsFormDialogOpen(false);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to save team member");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    {
      header: "Image",
      accessor: "image",
      cell: (row: ITeam) => (
        <img
          src={row.image}
          alt={row.name}
          className="w-10 h-10 rounded-full"
        />
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: ITeam) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <FaEllipsisV className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
                  <CardTitle className="text-2xl font-bold">
                    Team Members
                  </CardTitle>
                  <Button onClick={handleAdd}>
                    <FaPlus className="mr-2 h-4 w-4" /> Add Member
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <>
                      <Table data={teamMembers} columns={columns} />
                      <Pagination className="mt-4">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              disabled={currentPage === 1}
                            />
                          </PaginationItem>
                          {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                              <PaginationLink
                                onClick={() => setCurrentPage(index + 1)}
                                isActive={currentPage === index + 1}
                              >
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(totalPages, prev + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>
            {editingMember ? "Edit Team Member" : "Add Team Member"}
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                type="text"
                id="role"
                {...register("role", { required: "Role is required" })}
              />
              {errors.role && (
                <span className="text-red-500">{errors.role.message}</span>
              )}
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                accept="image/*"
                id="image"
                type="file"
                {...register("image")}
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input type="url" id="facebook" {...register("facebook")} />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input type="url" id="twitter" {...register("twitter")} />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input type="url" id="instagram" {...register("instagram")} />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input type="url" id="linkedin" {...register("linkedin")} />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeam;
