import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const contactSchema = Yup.object().shape({
  fullName: Yup.string().required("Name is required"),
  number: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required"),
});

const Contact: React.FC = () => {
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      console.log("Submitting values:", values);
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json(); // Parse error details from response
        throw new Error(errorData.message || "Failed to submit enquiry");
      }

      toast.success(
        "Thank you for your message. We will get back to you soon!"
      );
      resetForm();
    } catch (error: any) {
      console.error("Error submitting enquiry:", error);
      toast.error(`Failed to submit enquiry: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <Formik
                initialValues={{
                  fullName: "", // Fixed field name to match validation schema
                  number: "",
                  email: "",
                  message: "",
                }}
                validationSchema={contactSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <Field
                        type="text"
                        name="fullName" // Correct name field
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="number"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <Field
                        type="text"
                        name="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="number"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <Field
                        as="textarea"
                        name="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <ErrorMessage
                        name="message"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>

            <div className="w-full md:w-1/2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.378895097639!2d85.33917937370974!3d27.736457124210116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19d0c66673dd%3A0x28357de4f722f34d!2swaterproofing%20house(trinity%20waterproofing%20and%20suppliers)!5e0!3m2!1sen!2snp!4v1736315630592!5m2!1sen!2snp"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
