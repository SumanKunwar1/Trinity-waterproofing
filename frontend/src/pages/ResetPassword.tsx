import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Validation schema for reset password
const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPasswordForm: React.FC = () => {
  const handleSubmit = async (values: { newPassword: string }) => {
    try {
      // Mock API call to reset the password
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Password reset successfully!");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData?.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left section with image */}
            <div className="w-full md:w-1/2">
              <img
                src="/assets/password-reset.png" // Replace with your image path
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
                initialValues={{ newPassword: "", confirmPassword: "" }}
                validationSchema={resetPasswordSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordForm;
