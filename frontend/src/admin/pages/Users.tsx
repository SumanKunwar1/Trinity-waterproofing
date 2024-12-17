import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUser,
  FaUserShield,
  FaBuilding,
} from "react-icons/fa";
import { Button } from "../components/ui/button"; // ShadCN Button
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card"; // ShadCN Card components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"; // ShadCN Dialog
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"; // ShadCN Tabs
import Table from "../components/ui/table";
import FormikForm from "../components/FormikForm";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer" | "business";
  type: "B2B" | "B2C";
  createdAt: string;
}

const userSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  role: Yup.string()
    .oneOf(["admin", "customer", "business"])
    .required("Required"),
  type: Yup.string().oneOf(["B2C", "B2B"]).required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

const Users: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "customer",
      type: "B2C",
      createdAt: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      type: "B2C",
      createdAt: "2023-02-20",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "customer",
      type: "B2C",
      createdAt: "2023-03-10",
    },
    {
      id: 4,
      name: "Acme Corp",
      email: "info@acme.com",
      role: "business",
      type: "B2B",
      createdAt: "2023-04-05",
    },
  ]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      cell: (row: User) => (
        <span className="flex items-center">
          {row.role === "admin" ? (
            <FaUserShield className="mr-2" />
          ) : row.role === "business" ? (
            <FaBuilding className="mr-2" />
          ) : (
            <FaUser className="mr-2" />
          )}
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </span>
      ),
    },
    { header: "Type", accessor: "type" },
    { header: "Created At", accessor: "createdAt" },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: User) => (
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

  const handleSubmit = (
    values: Omit<User, "id" | "createdAt"> & { password: string },
    { resetForm }: any
  ) => {
    const { password, ...userData } = values;
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...userData } : u))
      );
      toast.success("User updated successfully");
    } else {
      const newUser = {
        ...userData,
        id: users.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
      toast.success("User added successfully");
    }
    setEditingUser(null);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    toast.success("User deleted successfully");
  };

  const formFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "customer", label: "Customer" },
        { value: "admin", label: "Admin" },
        { value: "business", label: "Business" },
      ],
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "B2C", label: "B2C" },
        { value: "B2B", label: "B2B" },
      ],
    },
    { name: "password", label: "Password", type: "password" },
  ];

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
                    <CardTitle className="text-2xl font-bold">Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="b2c">B2C Users</TabsTrigger>
                        <TabsTrigger value="b2b">B2B Users</TabsTrigger>
                        <TabsTrigger value="admins">Admins</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <Table columns={columns} data={users} />
                      </TabsContent>
                      <TabsContent value="b2c">
                        <Table
                          columns={columns}
                          data={users.filter((u) => u.type === "B2C")}
                        />
                      </TabsContent>
                      <TabsContent value="b2b">
                        <Table
                          columns={columns}
                          data={users.filter((u) => u.type === "B2B")}
                        />
                      </TabsContent>
                      <TabsContent value="admins">
                        <Table
                          columns={columns}
                          data={users.filter((u) => u.role === "admin")}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    <FaPlus className="mr-2" /> Add New User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogTitle>
                    {editingUser ? "Edit User" : "Add New User"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser
                      ? "Edit the details of the user."
                      : "Add a new user to the system."}
                  </DialogDescription>
                  <FormikForm
                    initialValues={
                      editingUser || {
                        name: "",
                        email: "",
                        role: "customer",
                        type: "B2C",
                        password: "",
                      }
                    }
                    validationSchema={userSchema}
                    onSubmit={handleSubmit}
                    fields={formFields}
                    submitButtonText={editingUser ? "Update User" : "Add User"}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Users;
