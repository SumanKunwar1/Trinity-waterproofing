import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required"),
});

const Contact: React.FC = () => {
  const handleSubmit = (values: any, { setSubmitting, resetForm }: any) => {
    // Implement contact form submission logic here
    console.log("Contact form values:", values);
    setTimeout(() => {
      setSubmitting(false);
      resetForm();
      alert("Thank you for your message. We will get back to you soon!");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
          <div className="max-w-md mx-auto">
            <Formik
              initialValues={{ name: "", email: "", message: "" }}
              validationSchema={contactSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="name"
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
                  <Button type="submit" className="w-full">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
