import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { toast } from "react-toastify";

// Validation Schema using Yup
const registerSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Form submission handler
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      console.log(values);
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          number: values.phone, // Note: Send `phone` as `number` to match backend validation
          password: values.password,
          role: "b2c",
        }),
      });
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        toast.success("Registration successful! Please log in.");
        navigate("/login"); // Redirect to login page
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(
          errorData?.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
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
                src="/assets/register-vector.svg"
                alt="Register Illustration"
                className="w-full max-w-md mx-auto"
              />
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <h1 className="text-3xl font-bold mb-2 text-center">
                Let's Create Your Account
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Join our community and start your journey!
              </p>
              <Formik
                initialValues={{
                  fullName: "",
                  email: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={registerSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form>
                    <Input label="Full Name" name="fullName" type="text" />
                    <Input label="Email" name="email" type="email" />
                    <Input label="Phone Number" name="phone" type="text" />
                    <Input label="Password" name="password" type="password" />
                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                    />
                    <Button type="submit" className="w-full mt-4">
                      Register
                    </Button>
                  </Form>
                )}
              </Formik>
              <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login here
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

export default Register;
