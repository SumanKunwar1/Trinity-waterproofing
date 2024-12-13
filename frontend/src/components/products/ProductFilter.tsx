import React from 'react';
import { Formik, Form, Field } from 'formik';
import { categories } from '../../constants/categories';

interface ProductFilterProps {
  onFilter: (filters: any) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilter }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Filter Products</h2>
      <Formik
        initialValues={{
          category: '',
          subcategory: '',
          priceRange: '',
        }}
        onSubmit={(values) => {
          onFilter(values);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Field
                as="select"
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue('category', e.target.value);
                  setFieldValue('subcategory', '');
                }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Field>
            </div>
            {values.category && (
              <div className="mb-4">
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <Field
                  as="select"
                  name="subcategory"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Subcategories</option>
                  {categories
                    .find((category) => category.id === parseInt(values.category))
                    ?.subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                </Field>
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <Field
                as="select"
                name="priceRange"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200+">$200+</option>
              </Field>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Apply Filters
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductFilter;

