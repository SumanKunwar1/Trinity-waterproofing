import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { toast } from "react-toastify";

// Validation schema with newPassword and confirmPassword
const forgetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ForgetPassword: React.FC = () => {
  const handleSubmit = async (values: {
    email: string;
    newPassword: string;
  }) => {
    try {
      // Make the reset password request to your backend API
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          newPassword: values.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password has been reset successfully!");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData?.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      // console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="w-full md:w-1/2">
              <img
                src="/assets/reset-vector.svg"
                alt="Forget Password Illustration"
                className="w-full max-w-md mx-auto"
              />
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <h1 className="text-3xl font-bold mb-2 text-center">
                Reset Your Password
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Please enter your email and new password.
              </p>
              <Formik
                initialValues={{
                  email: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={forgetPasswordSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form>
                    <Input label="Email" name="email" type="email" />
                    <Input
                      label="New Password"
                      name="newPassword"
                      type="password"
                    />
                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                    />
                    <Button type="submit" className="w-full mt-4">
                      Reset Password
                    </Button>
                  </Form>
                )}
              </Formik>
              <p className="mt-4 text-center">
                Remembered your password?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgetPassword;
