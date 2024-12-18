"use client";

import React, { useState, useEffect } from "react";
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
import { Button } from "../components/ui/button";
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

interface User {
  id: number;
  name: string;
  email: string;
  role: "B2B" | "B2C";
  createdAt: string;
}

const userSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  role: Yup.string().oneOf(["B2C", "B2B"]).required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

const Users: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
    },
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

  const handleSubmit = async (
    values: Omit<User, "id" | "createdAt"> & { password: string },
    { resetForm }: any
  ) => {
    try {
      const { password, ...userData } = values;
      if (editingUser) {
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        setUsers(
          users.map((u) =>
            u.id === editingUser.id ? { ...u, ...userData } : u
          )
        );
        toast.success("User updated successfully");
      } else {
        const response = await fetch("/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            password,
            role: "b2c",
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add user");
        }
        const newUser = await response.json();
        setUsers([...users, newUser]);
        toast.success("User added successfully");
      }
      setEditingUser(null);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting user:", error);
      toast.error("Failed to submit user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const formFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "role",
      label: "Role",
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
                      </TabsList>
                      <TabsContent value="all">
                        <Table columns={columns} data={users} />
                      </TabsContent>
                      <TabsContent value="b2c">
                        <Table
                          columns={columns}
                          data={users.filter((u) => u.role === "B2C")}
                        />
                      </TabsContent>
                      <TabsContent value="b2b">
                        <Table
                          columns={columns}
                          data={users.filter((u) => u.role === "B2B")}
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
                        role: "B2C",
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
