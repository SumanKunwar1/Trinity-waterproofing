import React, { useState, useEffect } from "react";
import { Settings, LogOut, User, KeyRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useLogout } from "../../utils/authUtils";
import NotificationComponent from "../../components/common/Notification";

const Topbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const handleLogout = useLogout();
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const userName = JSON.parse(localStorage.getItem("userFullName") || '""');
  const userEmail = JSON.parse(localStorage.getItem("userEmail") || '""');
  const userNumber = JSON.parse(localStorage.getItem("userNumber") || '""');

  const getInitials = (name: string) => {
    return (
      name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("")
        .substr(0, 2) || "N/A"
    );
  };

  const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const profileUpdateSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Phone Number is required"),
  });

  const handleChangePassword = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || '""');
      const response = await fetch(`/api/users/edit/password/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change password");
      }

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      setIsChangePasswordDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileUpdate = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || '""');

      const response = await fetch(`/api/users/edit/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          number: values.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsProfileDialogOpen(false);
      localStorage.setItem("userFullName", JSON.stringify(values.fullName));
      localStorage.setItem("userEmail", JSON.stringify(values.email));
      localStorage.setItem("userNumber", JSON.stringify(values.phone));
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <button
          className="text-gray-600 focus:outline-none md:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
      </div>

      <div className="flex items-center space-x-4 justify-end ml-auto">
        <NotificationComponent />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center focus:outline-none">
            <Avatar>
              <AvatarFallback className="bg-orange-500 text-white font-bold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <span className="ml-2">{userName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="border-b border-gray-200 border-t py-2"
              onSelect={() => setIsProfileDialogOpen(true)}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="border-b border-gray-200 py-2"
              onSelect={() => setIsChangePasswordDialogOpen(true)}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem
              className="border-b border-gray-200  py-2"
              onSelect={() => navigate("/admin/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 hover:text-white hover:bg-red-500 py-2 rounded-md transition duration-300"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={changePasswordSchema}
            onSubmit={handleChangePassword}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="block mb-2">
                    Current Password
                  </label>
                  <Field
                    type="password"
                    name="oldPassword"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="oldPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block mb-2">
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2">
                    Confirm New Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Changing..." : "Change Password"}
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              fullName: userName,
              email: userEmail,
              phone: userNumber,
            }}
            validationSchema={profileUpdateSchema}
            onSubmit={handleProfileUpdate}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block mb-2">
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="fullName"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-2">
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Toaster />
    </header>
  );
};

export default Topbar;
