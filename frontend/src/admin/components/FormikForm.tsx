import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
}

interface FormikFormProps {
  initialValues: Record<string, any>;
  validationSchema: any;
  onSubmit: (values: any, actions: any) => void;
  fields: FormField[];
  submitButtonText: string;
}

const FormikForm: React.FC<FormikFormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitButtonText,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          {fields.map((field) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <Field
                  as="select"
                  name={field.name}
                  className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                    errors[field.name] && touched[field.name]
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              ) : (
                <Field
                  name={field.name}
                  type={field.type}
                  className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
                    errors[field.name] && touched[field.name]
                      ? "border-red-500"
                      : ""
                  }`}
                />
              )}
              <ErrorMessage
                name={field.name}
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </motion.div>
          ))}
          <motion.button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {submitButtonText}
          </motion.button>
        </Form>
      )}
    </Formik>
  );
};

export default FormikForm;
