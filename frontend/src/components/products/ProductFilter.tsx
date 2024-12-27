import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import Slider from "rc-slider";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import axios from "axios";
import "rc-slider/assets/index.css";
import { Category } from "../../types/category";
import { SubCategory } from "../../types/subCategory";
import { FilterValues } from "../../types/filterValues";
interface ProductFilterProps {
  onFilter: (filters: FilterValues) => void;
  categories: Category[];
  subCategories: SubCategory[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilter }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubCategory[]>([]);

  // Fetch categories from API
  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category");
      console.log("Categories fetched:", response.data);
      setCategories(response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch categories";
      toast.error(errorMessage); // Show error message in toast notification
    }
  };

  // Fetch subcategories from API
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("/api/subcategory");
      console.log("Subcategories fetched:", response.data);
      setAllSubcategories(response.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch subcategories";
      toast.error(errorMessage); // Show error message in toast notification
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Get filtered subcategories based on selected category
  const getFilteredSubcategories = (categoryId: string) => {
    return allSubcategories.filter(
      (subcategory) => subcategory.category === categoryId
    );
  };

  // Get max price for the selected category
  const getMaxPrice = (categoryId: string) => {
    const subcategories = getFilteredSubcategories(categoryId);
    let maxPrice = 1000; // Default max price

    subcategories.forEach((subcategory) => {
      subcategory.product.forEach((product) => {
        if (product.price > maxPrice) {
          maxPrice = product.price;
        }
      });
    });

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
          const maxPriceForCategory = values.category
            ? getMaxPrice(values.category)
            : 1000;

          const filteredSubcategories = values.category
            ? getFilteredSubcategories(values.category)
            : [];

          return (
            <Form>
              {/* Category Dropdown */}
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
                    setFieldValue("minPrice", 0);
                    setFieldValue("maxPrice", getMaxPrice(categoryId));
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Subcategory Dropdown */}
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
                    {filteredSubcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
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
