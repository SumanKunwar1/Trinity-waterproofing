import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { Checkbox } from "../components/ui/checkbox";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

const Login: React.FC = () => {
  const handleSubmit = (values: any) => {
    // Implement login logic here
    console.log("Login values:", values);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="w-full md:w-1/2">
          <img
            src="/assets/login-vector.svg"
            alt="Login Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
        <div className="w-full md:w-1/2 max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back!</h1>
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
            {({ errors, touched }) => (
              <Form>
                <Input label="Email" name="email" type="email" />
                <Input label="Password" name="password" type="password" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      id="rememberMe"
                      as={Checkbox}
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
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
