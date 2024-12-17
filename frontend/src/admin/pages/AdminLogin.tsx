import { FaEnvelope, FaLock } from "react-icons/fa"; // Using icons for email and lock
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer here
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Input } from "../components/ui/input"; // Import ShadCN Input
import { Button } from "../components/ui/button"; // Import ShadCN Button

// Define the initial form values type
interface LoginFormValues {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const navigate = useNavigate();

  const mockCredentials = {
    email: "admin@gmail.com", 
    password: "admin123", 
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik for managing form state and validation
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
      // Simulate login check with hardcoded credentials
      if (
        values.email === mockCredentials.email &&
        values.password === mockCredentials.password
      ) {
        // Simulate success: store token and navigate
        localStorage.setItem("authToken", "mock-auth-token"); // Mock token
        toast.success("Login successful!");
        navigate("/admin/dashboard"); // Navigate to the admin dashboard
      } else {
        // Simulate failure: show error message
        toast.error("Invalid email or password. Please try again.");
      }

      // Set form submission state to false
      setSubmitting(false);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/assets/logo.png" alt="Logo" className="w-auto h-32" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6 text-text">
          Admin Login
        </h2>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2" htmlFor="email">
              Email
            </label>
            <div className="flex items-center border p-2 rounded">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className="border-none focus:outline-none"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-lg font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center border p-2 rounded">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your password"
                className="border-none focus:outline-none"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Login Button */}
          <Button type="submit" variant="secondary" className="w-full">
            Login
          </Button>
        </form>

        {/* ToastContainer to display toast notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminLogin;
