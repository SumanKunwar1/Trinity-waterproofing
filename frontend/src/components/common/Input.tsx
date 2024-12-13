import React from "react";
import { useField } from "formik";

interface InputProps {
  id?: string; // Making the id optional
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
}

const Input: React.FC<InputProps> = ({ label, id, value, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4">
      <label
        htmlFor={id || props.name} // Use id if provided, else use name
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        {...field}
        {...props}
        id={id || props.name}
        value={value}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default Input;
