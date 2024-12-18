"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

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

interface UserInfo {
  fullName: string;
  email: string;
  number: string;
  role: string;
}
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .substr(0, 2);
};
const defaultUserInfo: UserInfo = {
  fullName: "",
  email: "",
  number: "",
  role: "",
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  number: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  role: Yup.string().required("Role is required"),
});

export const ManageProfile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userString = localStorage.getItem("user");
  const user: UserInfo | null = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo({
        fullName: parsedUser.fullName,
        email: parsedUser.email,
        number: parsedUser.number,
        role: parsedUser.role,
      });
    }
  }, []);

  const handleSubmit = (values: UserInfo) => {
    const updatedUser = {
      ...values,
      password: JSON.parse(localStorage.getItem("user") || "{}").password,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserInfo(values);
    setIsDialogOpen(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <motion.div
      className="ml-6 w-full min-h-screen bg-gray-100 p-4 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Label className="tracking-wide text-2xl font-semibold">
        Manage Profile
      </Label>

      {/* Profile Image and Edit Section */}
      <motion.div
        className="bg-white mt-5 p-4 rounded-lg shadow-md"
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center pb-4">
          <div className="avatar mb-3">
            {user ? (
              <div className="avatar-inner w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                {user.fullName ? (
                  <span className="text-xl text-white">
                    {getInitials(user.fullName)}
                  </span>
                ) : (
                  <span className="text-xl text-white">U</span>
                )}
              </div>
            ) : (
              <div className="avatar-inner w-16 h-16 rounded-full bg-gray-300"></div>
            )}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">Update Profile</Button>
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
                          errors.email && touched.email ? "border-red-500" : ""
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
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Field
                        as={Input}
                        id="role"
                        name="role"
                        className={
                          errors.role && touched.role ? "border-red-500" : ""
                        }
                      />
                      {errors.role && touched.role && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.role}
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
        </div>
      </motion.div>

      {/* Profile Info Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5"
        style={{ backgroundColor: "#fbfbfb" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Full Name */}
        <InfoCard label="Full Name" value={userInfo.fullName} delay={0} />

        {/* Email */}
        <InfoCard label="Email" value={userInfo.email} delay={0.4} />

        {/* Phone Number */}
        <InfoCard label="Phone Number" value={userInfo.number} delay={0.6} />

        {/* Gender */}
        <InfoCard label="Role" value={userInfo.role} delay={0.8} />
      </motion.div>

      <ToastContainer position="bottom-right" />
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
