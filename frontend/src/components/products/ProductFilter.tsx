import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Brand } from "../../types/brand";

interface Category {
  _id: string;
  name: string;
  description?: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
  description?: string;
  category: string;
  products: Product[];
}

interface IColor {
  name: string;
  hex: string;
}

interface IReview {
  rating: number;
  content: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  wholeSalePrice: number;
  retailPrice: number;
  retailDiscountedPrice?: number;
  wholeSaleDiscountedPrice?: number;
  productImage: string;
  image: string[];
  subCategory: string;
  pdfUrl: string;
  features: string[];
  brand: string | Brand;
  createdAt: string;
  colors?: IColor[];
  inStock: number;
  review: IReview[];
}

interface FilterValues {
  category: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  rating: number[];
  inStock: boolean;
}

interface ProductFilterProps {
  onFilter: (filters: FilterValues) => void;
  categories: Category[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilter,
  categories,
}) => {
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);
  const userRole = localStorage.getItem("userRole");
  const priceKey = userRole === "b2b" ? "wholeSalePrice" : "retailPrice";

  const getFilteredSubcategories = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.subCategories : [];
  };

  const getMaxPrice = (categoryId: string) => {
    const subcategories = getFilteredSubcategories(categoryId);
    let maxPrice = 1000;

    subcategories.forEach((subcategory) => {
      subcategory.products.forEach((product) => {
        const price = product[priceKey as keyof Product] as number;
        if (price > maxPrice) {
          maxPrice = price;
        }
      });
    });

    return maxPrice;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Filter Products</h2>
      <Formik<FilterValues>
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

          const handleCategoryChange = (categoryId: string) => {
            setFieldValue("category", categoryId);
            setFieldValue("subcategory", "");
            setFieldValue("minPrice", 0);
            setFieldValue("maxPrice", getMaxPrice(categoryId));
            setFilteredSubcategories(getFilteredSubcategories(categoryId));
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
                    onValueChange={(value) =>
                      setFieldValue("subcategory", value)
                    }
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

              {/* Price Range */}
              <div>
                <label
                  htmlFor="priceRange"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price Range
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <Field
                    as={Input}
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    className="w-1/2"
                    min={0}
                    max={values.maxPrice}
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
                  />
                </div>
                <Slider
                  range
                  min={0}
                  max={maxPriceForCategory}
                  value={[values.minPrice, values.maxPrice]}
                  onChange={(value: number | number[]) => {
                    if (Array.isArray(value)) {
                      setFieldValue("minPrice", value[0]);
                      setFieldValue("maxPrice", value[1]);
                    }
                  }}
                  className="mt-2"
                />
              </div>

              {/* Rating Filters */}
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

              {/* Submit Button */}
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
