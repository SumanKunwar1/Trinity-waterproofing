// pages/AdminLogin.tsx
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { toast } from "react-toastify";

const adminLoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      // Make the login request to your backend API
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Check if a token is returned
        if (data?.token) {
          // Decode token to get user role
          function decodeToken(token: string) {
            try {
              const base64Url = token.split(".")[1];
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const decodedPayload = JSON.parse(window.atob(base64));
              return decodedPayload;
            } catch (e) {
              return null;
            }
          }

          const decoded = decodeToken(data.token);
          const userRole = decoded?.role;

          // Check if user is admin BEFORE storing anything
          if (userRole === "admin") {
            // Store the token in localStorage for persistent login
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userRole", userRole);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            toast.success("Admin login successful!");
            
            // Navigate to admin dashboard - removed window.location.reload()
            navigate("/admin/dashboard");
          } else {
            // Not an admin
            toast.error("Access denied. Admin privileges required.");
          }
        } else {
          toast.error("Invalid response from the server.");
        }
      } else {
        const errorData = await response.json();
        toast.error(
          errorData?.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
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
                src="/assets/admin-login.png"
                alt="Admin Login Illustration"
                className="w-full max-w-md mx-auto"
              />
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <h1 className="text-3xl font-bold mb-2 text-center">
                Admin Portal
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Secure access to administration dashboard
              </p>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={adminLoginSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form>
                    <Input label="Email" name="email" type="email" />
                    <Input label="Password" name="password" type="password" />
                    <Button type="submit" className="w-full mt-4">
                      Admin Login
                    </Button>
                  </Form>
                )}
              </Formik>
              <p className="mt-4 text-center">
                User login?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Go to User Login
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

export default AdminLogin;