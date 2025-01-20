import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Validation schema for email input
const emailValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const EmailForm: React.FC = () => {
  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await fetch(`api/users/forgot/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Reset email sent successfully! Check your inbox.");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData?.message || "Failed to send reset email. Please try again."
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
                src="/assets/email-reset.png" // Replace with your illustration path
                alt="Email Illustration"
                className="w-full max-w-sm mx-auto"
              />
            </div>
            {/* Right section with the form */}
            <div className="w-full md:w-1/2 max-w-md">
              <h1 className="text-3xl font-bold mb-2 text-center">
                Reset Password
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Please enter your email to receive a password reset link.
              </p>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={emailValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Input label="Email" name="email" type="email" />
                    <Button type="submit" className="w-full mt-4">
                      {isSubmitting ? "Sending..." : "Send Reset Email"}
                    </Button>
                  </Form>
                )}
              </Formik>

              <Button
                className="w-full mt-4"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailForm;
