import { useState } from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../common/Button";

const newsletterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Newsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    values: { email: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/newsletter", values);
      toast.success(
        response.data.message || "Thank you for subscribing to our newsletter!"
      );
      resetForm();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h3 className="text-white text-2xl font-semibold mb-4">
        Stay Updated with Trinity
      </h3>
      <p className="mb-6">
        Subscribe to our newsletter for the latest waterproofing tips, product
        updates, and exclusive offers.
      </p>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={newsletterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-1 text-left">
                  {errors.email}
                </div>
              )}
            </div>
            <Button type="submit" variant="primary" size="md" className="h-12">
              Subscribe Now
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Newsletter;
