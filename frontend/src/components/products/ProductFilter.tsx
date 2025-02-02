import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import type { Brand } from "../../types/brand";
import type { Category } from "../../types/category";
import type { SubCategory } from "../../types/subCategory";

interface ProductFilterProps {
  onFilter: (filters: FilterValues) => void;
  categories: Category[];
  brands: Brand[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string) => void;
  getMaxPrice: (categoryId: string) => number;
}

interface FilterValues {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  inStock: boolean;
  brands: string[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilter,
  categories,
  brands,
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  getMaxPrice,
}) => {
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);

  const getFilteredSubcategories = useCallback(
    (categoryId: string): SubCategory[] => {
      const category = categories.find((cat) => cat._id === categoryId);
      return category ? category.subCategories : [];
    },
    [categories]
  );

  useEffect(() => {
    if (selectedCategory) {
      setFilteredSubcategories(getFilteredSubcategories(selectedCategory));
    }
  }, [selectedCategory, getFilteredSubcategories]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-h-screen h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Filter Products</h2>
      <Formik<FilterValues>
        initialValues={{
          category: selectedCategory || "",
          subcategory: selectedSubcategory || "",
          minPrice: 0,
          maxPrice: selectedCategory ? getMaxPrice(selectedCategory) : 1000,
          rating: [],
          inStock: false,
          brands: [],
        }}
        enableReinitialize
        onSubmit={(values) => {
          onFilter(values);
        }}
      >
        {({ values, setFieldValue, submitForm }) => {
          const maxPriceForCategory = values.category
            ? getMaxPrice(values.category)
            : 1000;

          const handleCategoryChange = (categoryId: string) => {
            setFieldValue("category", categoryId);
            setFieldValue("subcategory", "");
            setFieldValue("minPrice", 0);
            setFieldValue("maxPrice", getMaxPrice(categoryId));
            setFilteredSubcategories(getFilteredSubcategories(categoryId));
            onCategoryChange(categoryId);
            submitForm(); // Apply filters immediately
          };

          const handleSubcategoryChange = (subcategoryId: string) => {
            setFieldValue("subcategory", subcategoryId);
            onSubcategoryChange(subcategoryId);
            submitForm(); // Apply filters immediately
          };

          return (
            <Form className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <Select
                  onValueChange={(value) => handleCategoryChange(value)}
                  value={values.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Dropdown */}
              {values.category && (
                <div>
                  <label
                    htmlFor="subcategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subcategory
                  </label>
                  <Select
                    onValueChange={(value) => handleSubcategoryChange(value)}
                    value={values.subcategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Subcategories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {filteredSubcategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory._id}
                          value={subcategory._id}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Brand Checkboxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brands
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brands.map((brand) => (
                    <div key={brand._id} className="flex items-center">
                      <Checkbox
                        id={`brand-${brand._id}`}
                        checked={values.brands.includes(brand._id)}
                        onCheckedChange={(checked) => {
                          const newBrands = checked
                            ? [...values.brands, brand._id]
                            : values.brands.filter((id) => id !== brand._id);
                          setFieldValue("brands", newBrands);
                        }}
                      />
                      <label
                        htmlFor={`brand-${brand._id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    value={values.minPrice}
                    onChange={(e) =>
                      setFieldValue("minPrice", Number(e.target.value))
                    }
                    className="w-20"
                  />
                  <span className="text-gray-600">-</span>
                  <Input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={values.maxPrice}
                    onChange={(e) =>
                      setFieldValue("maxPrice", Number(e.target.value))
                    }
                    className="w-20"
                  />
                </div>
                <Slider
                  range
                  min={0}
                  max={maxPriceForCategory}
                  defaultValue={[values.minPrice, values.maxPrice]}
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      setFieldValue("minPrice", value[0]);
                      setFieldValue("maxPrice", value[1]);
                    }
                  }}
                  className="mt-2"
                />
              </div>

              {/* Rating Filter */}
              <div>
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
                      {rating} {rating === 1 ? "star" : "stars"} or up
                    </label>
                  </div>
                ))}
              </div>

              {/* In Stock Filter */}
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

              {/* Apply Filters Button */}
              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductFilter;
