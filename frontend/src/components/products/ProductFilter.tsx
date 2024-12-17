import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import Slider from "rc-slider"; // Import the rc-slider component
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { categories } from "../../constants/categories";
import "rc-slider/assets/index.css"; // Import the CSS for the rc-slider

interface ProductFilterProps {
  onFilter: (filters: FilterValues) => void;
}

interface FilterValues {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  inStock: boolean;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilter }) => {
  // Get max price for the selected category
  const getMaxPrice = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return 1000; // Default max price if category is not found

    // Get the highest price from the products in the selected category
    const maxPrice = category.products.reduce((max, product) => {
      return product.price > max ? product.price : max;
    }, 0);

    return maxPrice;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Filter Products</h2>
      <Formik
        initialValues={{
          category: "",
          subcategory: "",
          minPrice: 0,
          maxPrice: 1000,
          rating: [],
          inStock: false,
        }}
        onSubmit={(values) => {
          onFilter(values);
        }}
      >
        {({ values, setFieldValue }) => {
          // Dynamically compute the maximum price for the selected category
          const maxPriceForCategory = values.category
            ? getMaxPrice(values.category)
            : 1000;

          return (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <Field
                  as="select"
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const categoryId = e.target.value;
                    setFieldValue("category", categoryId);
                    setFieldValue("subcategory", "");
                    setFieldValue("minPrice", 0); // Reset minPrice when category changes
                    setFieldValue("maxPrice", getMaxPrice(categoryId)); // Set maxPrice to the max for the selected category
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

              {/* Subcategory dropdown */}
              {values.category && (
                <div className="mb-4">
                  <label
                    htmlFor="subcategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subcategory
                  </label>
                  <Field
                    as="select"
                    name="subcategory"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Subcategories</option>
                    {categories
                      .find(
                        (category) => category.id === parseInt(values.category)
                      )
                      ?.subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                  </Field>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-4">
                <label
                  htmlFor="priceRange"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <Field
                    as={Input}
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    className="w-1/2"
                    min={0}
                    max={values.maxPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = parseInt(e.target.value);
                      setFieldValue("minPrice", value);
                    }}
                  />
                  <span>-</span>
                  <Field
                    as={Input}
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    className="w-1/2"
                    min={values.minPrice}
                    max={maxPriceForCategory}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = parseInt(e.target.value);
                      setFieldValue("maxPrice", value);
                    }}
                  />
                </div>

                {/* Slider for Price using rc-slider */}
                <Slider
                  range
                  value={[values.minPrice, values.maxPrice]}
                  min={0}
                  max={maxPriceForCategory}
                  step={10}
                  onChange={(value: [number, number]) => {
                    setFieldValue("minPrice", value[0]);
                    setFieldValue("maxPrice", value[1]);
                  }}
                  className="mt-2"
                />
              </div>

              {/* Rating Filters */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={values.rating.includes(rating)}
                      onCheckedChange={(checked) => {
                        const newRatings = checked
                          ? [...values.rating, rating]
                          : values.rating.filter((r) => r !== rating);
                        setFieldValue("rating", newRatings);
                      }}
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {rating} {rating === 1 ? "star" : "stars"} & up
                    </label>
                  </div>
                ))}
              </div>

              {/* In Stock Filter */}
              <div className="mb-4">
                <div className="flex items-center">
                  <Checkbox
                    id="inStock"
                    checked={values.inStock}
                    onCheckedChange={(checked) =>
                      setFieldValue("inStock", checked)
                    }
                  />
                  <label
                    htmlFor="inStock"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    In Stock Only
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Apply Filters
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductFilter;
