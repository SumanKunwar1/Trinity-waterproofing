import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

// Validation schema for resetting the password
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPasswordForm: React.FC = () => {
  const location = useLocation();
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get("token");

    if (!resetToken) {
      toast.error("Invalid or missing reset link.");
      return;
    }

    // Verify and decode token
    verifyToken(resetToken);
  }, [location]);

  const verifyToken = (resetToken: string) => {
    try {
      const decoded: any = jwtDecode(resetToken);
      if (decoded && decoded.exp) {
        if (decoded.exp * 1000 > Date.now()) {
          setToken(resetToken);
          setUserId(decoded.id);
          setIsValidToken(true);
          toast.success("Valid reset link. Please set your new password.");
        } else {
          toast.error("Reset link has expired.");
        }
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      toast.error("Invalid or expired reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    values: { password: string },
    { setSubmitting }: any
  ) => {
    if (!userId) {
      toast.error("User ID not found. Please try again.");
      return;
    }

    try {
      const response = await fetch(`api/users/edit/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully!");
      } else {
        toast.error(
          data?.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  if (!isValidToken) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center mx-auto min-h-screen max-w-screen-md w-full sm:w-3/4">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left section with image */}
            <div className="w-full md:w-1/2">
              <img
                src="/assets/password-reset.png"
                alt="Password Reset Illustration"
                className="w-full max-w-sm mx-auto"
              />
            </div>
            {/* Right section with the form */}
            <div className="w-full md:w-1/2 max-w-md">
              <h1 className="text-3xl font-bold mb-2 text-center">
                Set New Password
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Please enter your new password below.
              </p>
              <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={resetPasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Input
                      label="New Password"
                      name="password"
                      type="password"
                    />
                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                    />
                    <Button type="submit" className="w-full mt-4">
                      {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordForm;
