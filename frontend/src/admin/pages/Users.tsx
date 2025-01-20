import { useState, useEffect } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Table from "../components/ui/table";
import FormikForm from "../components/FormikForm";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../components/ui/pagination";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  number: string;
  createdAt: string;
}

const userSchema = Yup.object().shape({
  fullName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  role: Yup.string().oneOf(["b2b", "b2c"]).required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  number: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Required"),
});

const Users: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.error || "Failed to fetch users";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error: any) {
      // console.error("Error fetching users:", error);
      toast.error(error.message || "An unexpected error occurred!");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const columns = [
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Phone", accessor: "number" },
    { header: "Created At", accessor: "createdAt" },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: User) => (
        <div className="flex space-x-2">
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

  const handleSubmit = async (
    values: Omit<User, "_id" | "createdAt"> & { password: string },
    { resetForm }: any
  ) => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.error || "Failed to add user";
        throw new Error(errorMessage);
      }
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setFilteredUsers([...filteredUsers, newUser]);
      toast.success("User added successfully");
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      // console.error("Error submitting user:", error);
      toast.error(error.message || "An unexpected error occurred!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/adminDelete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.error || "Failed to delete user";
        throw new Error(errorMessage);
      }
      const updatedUsers = users.filter((u) => u._id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      toast.success("User deleted successfully");
    } catch (error: any) {
      // console.error("Error deleting user:", error);
      toast.error(error.message || "An unexpected error occurred!");
    }
  };

  const formFields = [
    { name: "fullName", label: "Full Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "b2c", label: "B2C" },
        { value: "b2b", label: "B2B" },
      ],
    },
    { name: "password", label: "Password", type: "password" },
    { name: "number", label: "Phone Number", type: "text" },
  ];

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold">Users</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="secondary">
                          <FaPlus className="mr-2" /> Add New User
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Add a new user to the system.
                        </DialogDescription>
                        <FormikForm
                          initialValues={{
                            fullName: "",
                            email: "",
                            role: "b2c",
                            password: "",
                            number: "",
                          }}
                          validationSchema={userSchema}
                          onSubmit={handleSubmit}
                          fields={formFields}
                          submitButtonText="Add User"
                        />
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center">
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm mr-2"
                      />
                      <FaSearch className="text-gray-400" />
                    </div>
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="b2c">B2C Users</TabsTrigger>
                        <TabsTrigger value="b2b">B2B Users</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <Table columns={columns} data={currentUsers} />
                      </TabsContent>
                      <TabsContent value="b2c">
                        <Table
                          columns={columns}
                          data={currentUsers.filter((u) => u.role === "b2c")}
                        />
                      </TabsContent>
                      <TabsContent value="b2b">
                        <Table
                          columns={columns}
                          data={currentUsers.filter((u) => u.role === "b2b")}
                        />
                      </TabsContent>
                    </Tabs>
                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        />
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        />
                      </PaginationContent>
                    </Pagination>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Users;
