import React, { useState } from "react";
import { Bell, Settings, LogOut, User, KeyRound, Check, X } from "lucide-react";
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
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Notification types
interface Notification {
  id: number;
  type: "order" | "inquiry" | "message";
  message: string;
  link: string;
  read: boolean;
}

const Topbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "order",
      message: "New Order #1234",
      link: "/orders",
      read: false,
    },
    {
      id: 2,
      type: "inquiry",
      message: "New Customer Inquiry",
      link: "/inquiries",
      read: false,
    },
  ]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Change Password Validation Schema
  const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include uppercase, lowercase, number, and special character"
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Profile Update Validation Schema
  const profileUpdateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    username: Yup.string()
      .min(4, "Username must be at least 4 characters")
      .required("Username is required"),
  });

  // Notification Management Functions
  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (link: string, id: number) => {
    markNotificationAsRead(id);
    navigate(link);
    setIsNotificationOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  // Handle change password submission
  const handleChangePassword = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      setIsChangePasswordDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle profile update submission
  const handleProfileUpdate = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsProfileDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Mobile Sidebar Toggle */}
      <div>
        <button
          className="text-gray-600 focus:outline-none md:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        {/* Page Title */}
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4 justify-end ml-auto">
        {/* Notifications */}
        <div className="relative text-center align-middle items-center">
          <div
            className="relative cursor-pointer text-center align-middle items-center"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell className="text-gray-600 text-center align-middle items-center" />
            {unreadNotificationsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-red-600 hover:bg-red-600 rounded-full text-white"
              >
                {unreadNotificationsCount}
              </Badge>
            )}
          </div>

          {isNotificationOpen && notifications.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg rounded-md border z-50">
              {/* Notification Header */}
              <div className="flex flex-col justify-between p-2 border-b">
                <span className="font-semibold text-center mb-2">
                  Notifications
                </span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark All Read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Notification List */}
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center p-2 hover:bg-gray-100 ${
                    notification.read ? "bg-gray-50 text-gray-500" : "bg-white"
                  }`}
                >
                  <div
                    className="flex-grow cursor-pointer"
                    onClick={() =>
                      handleNotificationClick(
                        notification.link,
                        notification.id
                      )
                    }
                  >
                    {notification.message}
                  </div>

                  {/* Notification Actions */}
                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center focus:outline-none">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
              alt="User avatar"
            />
            <span className="ml-2">Admin User</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setIsProfileDialogOpen(true)}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setIsChangePasswordDialogOpen(true)}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Change Password Dialog */}
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
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={changePasswordSchema}
            onSubmit={handleChangePassword}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block mb-2">
                    Current Password
                  </label>
                  <Field
                    type="password"
                    name="currentPassword"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="currentPassword"
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

      {/* Profile Update Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              name: "Admin User",
              email: "admin@example.com",
              username: "admin_user",
            }}
            validationSchema={profileUpdateSchema}
            onSubmit={handleProfileUpdate}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    Full Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="name"
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
                  <label htmlFor="username" className="block mb-2">
                    Username
                  </label>
                  <Field
                    type="text"
                    name="username"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="username"
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
