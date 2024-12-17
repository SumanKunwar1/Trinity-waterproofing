import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { Checkbox } from "../components/ui/checkbox";

const registerSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  agreeTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions"
  ),
});

const Register: React.FC = () => {
  const handleSubmit = (values: any) => {
    // Implement registration logic here
    console.log("Register values:", values);
  };

  return (
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
              password: "",
              confirmPassword: "",
              agreeTerms: false,
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Input label="Full Name" name="fullName" type="text" />
                <Input label="Email" name="email" type="email" />
                <Input label="Password" name="password" type="password" />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                />
                <div className="flex items-center mb-4">
                  <Field
                    type="checkbox"
                    name="agreeTerms"
                    id="agreeTerms"
                    as={Checkbox}
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="ml-2 text-sm text-gray-600"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
                {errors.agreeTerms && touched.agreeTerms && (
                  <div className="text-red-500 text-sm mb-4">
                    {errors.agreeTerms}
                  </div>
                )}
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
  );
};

export default Register;
