import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import axios from "axios";

import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

// User info interface
interface UserInfo {
  fullName: string;
  email: string;
  number: string;
}

// Validation schema for profile edit
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  number: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
});

// Password change validation schema
const passwordChangeSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const getInitials = (name?: string) => {
  if (!name || name.trim() === "") {
    return "N/A"; // Default initials if name is missing or empty
  }
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substr(0, 2);
};

export const ManageProfile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: "",
    email: "",
    number: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get the user information from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo({
        fullName: parsedUser.fullName,
        email: parsedUser.email,
        number: parsedUser.number,
      });
    }
  }, []);

  // Handle updating profile information
  const handleSubmit = async (values: UserInfo) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");

      const response = await axios.patch(
        `/api/users/edit/${userId}`,
        {
          fullName: values.fullName,
          email: values.email,
          number: values.number,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Profile updated successfully!");
        setUserInfo(values);
        localStorage.setItem("user", JSON.stringify(values));
        localStorage.setItem("userFullName", JSON.stringify(values.fullName));
        localStorage.setItem("userEmail", JSON.stringify(values.email));
        localStorage.setItem("userNumber", JSON.stringify(values.number));
        setIsDialogOpen(false); // Close the dialog
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
    }
  };

  // Handle changing password
  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const authToken = localStorage.getItem("authToken");
      const response = await axios.patch(
        `/api/users/edit/password/${userId}`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Password changed successfully!");
        setIsPasswordDialogOpen(false);
        localStorage.setItem(
          "userPassword",
          JSON.stringify(values.newPassword)
        );
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } catch (error) {
      toast.error("Error changing password. Please try again.");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const authToken = localStorage.getItem("authToken");
      const response = await axios.delete(`/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("Account deleted successfully!");
        localStorage.clear(); // Clear localStorage after deletion
        // Redirect user to home or login page
        window.location.href = "/";
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } catch (error) {
      toast.error("Error deleting account. Please try again.");
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Label className="tracking-wide text-2xl font-semibold mb-4">
        Manage Profile
      </Label>

      {/* Profile Image and Edit Section */}
      <motion.div
        className="bg-gradient-to-r from-primary to-blue-500 mt-5 p-4 sm:p-6 rounded-lg shadow-md"
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center pb-2 pt-2 space-y-4 sm:space-y-0">
          <div className="avatar">
            <div className="avatar-inner w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-orange-500 to-secondary flex items-center justify-center">
              <span className="text-xl sm:text-2xl text-white">
                {getInitials(userInfo.fullName)}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto hover:bg-hover transition-all duration-300 font-semibold"
                >
                  Update Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <Formik
                  initialValues={userInfo}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Field
                          as={Input}
                          id="fullName"
                          name="fullName"
                          className={
                            errors.fullName && touched.fullName
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.fullName && touched.fullName && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.fullName}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          className={
                            errors.email && touched.email
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.email && touched.email && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="number">Phone Number</Label>
                        <Field
                          as={Input}
                          id="number"
                          name="number"
                          className={
                            errors.number && touched.number
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.number && touched.number && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.number}
                          </div>
                        )}
                      </div>
                      <Button type="submit" className="w-full">
                        Save Changes
                      </Button>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isPasswordDialogOpen}
              onOpenChange={setIsPasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto hover:bg-secondary hover:text-white transition-all duration-300 font-semibold"
                >
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <Formik
                  initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={passwordChangeSchema}
                  onSubmit={handleChangePassword}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Label htmlFor="oldPassword" className="mb-2">
                          Old Password
                        </Label>
                        <Field
                          as={Input}
                          id="oldPassword"
                          name="oldPassword"
                          type="password"
                          className={
                            errors.oldPassword && touched.oldPassword
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.oldPassword && touched.oldPassword && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.oldPassword}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="newPassword" className="mb-2">
                          New Password
                        </Label>
                        <Field
                          as={Input}
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          className={
                            errors.newPassword && touched.newPassword
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.newPassword && touched.newPassword && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.newPassword}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="mb-2">
                          Confirm New Password
                        </Label>
                        <Field
                          as={Input}
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className={
                            errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                      <Button type="submit" className="w-full">
                        Change Password
                      </Button>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Profile Info Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-5"
        style={{ backgroundColor: "#fbfbfb" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <InfoCard label="Full Name" value={userInfo.fullName} delay={0} />
        <InfoCard label="Email" value={userInfo.email} delay={0.4} />
        <InfoCard label="Phone Number" value={userInfo.number} delay={0.6} />
      </motion.div>

      {/* Add Delete Account Button */}
      <motion.div
        className="mt-5 flex justify-center sm:justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold"
            >
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  );
};

interface InfoCardProps {
  label: string;
  value: string;
  delay: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, delay }) => (
  <motion.div
    className="shadow-md w-full p-4 bg-white rounded-md"
    initial={{ y: "-100vh" }}
    animate={{ y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Label className="text-gray-700">{label}</Label>
    <div className="bg-white p-2 mt-3 rounded-md shadow-sm">
      <Label className="text-gray-700">{value}</Label>
    </div>
  </motion.div>
);

export default ManageProfile;
