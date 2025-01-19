import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { toast } from "react-toastify";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

const Login: React.FC = () => {
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

      // Check if the response is successful (status 200)
      if (response.ok) {
        const data = await response.json();

        // Check if a token is returned
        if (data?.token) {
          // Store the token in localStorage for persistent login
          const decoded = decodeToken(data.token);
          const userRole = decoded?.role;

          // console.log(userRole);

          // Store token and role in localStorage
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userId", JSON.stringify(data.user._id));
          localStorage.setItem(
            "userFullName",
            JSON.stringify(data.user.fullName)
          );
          localStorage.setItem("userEmail", JSON.stringify(data.user.email));
          localStorage.setItem(
            "userPassword",
            JSON.stringify(data.user.password)
          );
          localStorage.setItem("userNumber", JSON.stringify(data.user.number));
          // console.log(data.user);
          toast.success("Login successful!");

          if (userRole === "admin") {
            navigate("/admin/dashboard");
            window.location.reload();
          } else if (userRole === "b2c" || userRole === "b2b") {
            navigate("/customer/dashboard");
            window.location.reload();
          } else {
            navigate("/");
            window.location.reload();
          }
        } else {
          toast.error("Invalid response from the server. Please try again.");
        }
      } else {
        const errorData = await response.json();
        toast.error(
          errorData?.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      // console.log(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  function decodeToken(token: string) {
    try {
      const base64Url = token.split(".")[1]; // JWT is in the form: header.payload.signature
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Decode URL-safe base64 to standard base64
      const decodedPayload = JSON.parse(window.atob(base64)); // Decode base64 and parse JSON
      return decodedPayload;
    } catch (e) {
      // console.error("Invalid token", e);
      return null;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="w-full md:w-1/2">
              <img
                src="/assets/login-bro.png"
                alt="Login Illustration"
                className="w-full max-w-md mx-auto"
              />
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <h1 className="text-3xl font-bold mb-2 text-center">
                Welcome Back!
              </h1>
              <p className="text-center text-gray-600 mb-8">
                We're so excited to see you again!
              </p>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  rememberMe: false,
                }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form>
                    <Input label="Email" name="email" type="email" />
                    <Input label="Password" name="password" type="password" />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          id="rememberMe"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="ml-2 text-sm text-gray-600"
                        >
                          Remember me
                        </label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Button type="submit" className="w-full mt-4">
                      Login
                    </Button>
                  </Form>
                )}
              </Formik>
              <p className="mt-4 text-center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Register here
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

export default Login;
