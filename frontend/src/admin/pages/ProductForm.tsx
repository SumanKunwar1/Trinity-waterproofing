import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface Variant {
  color?: string;
  volume?: string;
  label?: string;
  value?: string;
  price: number;
  isColorChecked?: boolean;
  isVolumeChecked?: boolean;
}

interface Product {
  _id?: string;
  name: string;
  brand: string;
  retailPrice: number;
  wholeSalePrice: number;
  description: string;
  productImage: File | null;
  image: File[];
  features: string;
  variants: Variant[];
  inStock: number;
  subCategory: string;
}

const productSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  brand: Yup.string().required("Brand name is required"),
  retailPrice: Yup.number()
    .positive("Retail price must be positive")
    .required("Retail price is required"),
  wholeSalePrice: Yup.number()
    .positive("Wholesale price must be positive")
    .required("Wholesale price is required"),
  description: Yup.string().required("Description is required"),
  inStock: Yup.number()
    .integer("Stock number must be an integer")
    .min(0, "Stock must be at least 0")
    .required("Stock is required"),
  subCategory: Yup.string().required("Sub category is required"),
  variants: Yup.array().of(Yup.object()),
});

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<
    { _id: string; name: string }[]
  >([]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
    fetchSubcategories();
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await axios.get(`/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setProduct({
        ...response.data,
        features: JSON.stringify(response.data.features, null, 2),
        productImage: null,
        image: [],
      });
    } catch (error) {
      toast.error("Failed to fetch product");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("/api/subcategory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSubcategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch subcategories");
    }
  };

  const handleSubmit = async (values: Product) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "productImage" && values.productImage) {
          formData.append("productImage", values.productImage);
        } else if (key === "image") {
          values.image.forEach((img, index) => {
            formData.append(`image`, img);
          });
        } else if (key === "features") {
          formData.append(key, values[key]);
        } else if (key === "variants") {
          const processedVariants = values.variants.map((variant) => ({
            ...variant,
            color: variant.isColorChecked ? variant.color : undefined,
            volume: variant.isVolumeChecked ? variant.volume : undefined,
          }));
          formData.append(key, JSON.stringify(processedVariants));
        } else {
          formData.append(key, String(values[key]));
        }
      });

      if (id) {
        await axios.patch(`/api/product/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post("/api/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Product added successfully");
      }
      navigate("/admin/products");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Failed to save product: ${error.response.data.message}`);
      } else {
        toast.error("Failed to save product");
      }
    }
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{id ? "Edit Product" : "Add New Product"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={
                    product || {
                      name: "",
                      brand: "",
                      retailPrice: 0,
                      wholeSalePrice: 0,
                      description: "",
                      productImage: null,
                      image: [],
                      features: "",
                      variants: [
                        {
                          color: "",
                          volume: "",
                          label: "",
                          value: "",
                          price: 0,
                          isColorChecked: false,
                          isVolumeChecked: false,
                        },
                      ],
                      inStock: 0,
                      subCategory: "",
                    }
                  }
                  validationSchema={productSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ errors, touched, setFieldValue, values }) => (
                    <Form className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Field name="name" as={Input} />
                        {errors.name && touched.name && (
                          <div className="text-red-500">{errors.name}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Field name="brand" as={Input} />
                        {errors.brand && touched.brand && (
                          <div className="text-red-500">{errors.brand}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="retailPrice">Retail Price</Label>
                        <Field name="retailPrice" type="number" as={Input} />
                        {errors.retailPrice && touched.retailPrice && (
                          <div className="text-red-500">
                            {errors.retailPrice}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="wholeSalePrice">Wholesale Price</Label>
                        <Field name="wholeSalePrice" type="number" as={Input} />
                        {errors.wholeSalePrice && touched.wholeSalePrice && (
                          <div className="text-red-500">
                            {errors.wholeSalePrice}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Field
                          name="description"
                          as="textarea"
                          className="w-full p-2 border rounded"
                        />
                        {errors.description && touched.description && (
                          <div className="text-red-500">
                            {errors.description}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="productImage">Product Image</Label>
                        <Input
                          id="productImage"
                          name="productImage"
                          type="file"
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (event.currentTarget.files) {
                              setFieldValue(
                                "productImage",
                                event.currentTarget.files[0]
                              );
                            }
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="additionalImages">
                          Additional Images
                        </Label>
                        <Input
                          id="additionalImages"
                          name="image"
                          type="file"
                          multiple
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (event.currentTarget.files) {
                              setFieldValue(
                                "image",
                                Array.from(event.currentTarget.files)
                              );
                            }
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="features">Features</Label>
                        <Field name="features">
                          {({ field }) => (
                            <Editor
                              value={field.value}
                              onChange={(content) =>
                                setFieldValue("features", content)
                              }
                            />
                          )}
                        </Field>
                      </div>

                      <div>
                        <Label>Variants</Label>
                        <FieldArray name="variants">
                          {({ push, remove }) => (
                            <div>
                              {values.variants.map((_, index) => (
                                <div
                                  key={index}
                                  className="mb-4 p-4 border rounded"
                                >
                                  <div className="flex space-x-4 mb-2">
                                    <div>
                                      <Checkbox
                                        id={`isColorChecked-${index}`}
                                        checked={
                                          values.variants[index].isColorChecked
                                        }
                                        onCheckedChange={(checked) => {
                                          setFieldValue(
                                            `variants.${index}.isColorChecked`,
                                            checked
                                          );
                                          if (!checked) {
                                            setFieldValue(
                                              `variants.${index}.color`,
                                              ""
                                            );
                                          }
                                        }}
                                      />
                                      <Label
                                        htmlFor={`isColorChecked-${index}`}
                                      >
                                        Color
                                      </Label>
                                    </div>
                                    <div>
                                      <Checkbox
                                        id={`isVolumeChecked-${index}`}
                                        checked={
                                          values.variants[index].isVolumeChecked
                                        }
                                        onCheckedChange={(checked) => {
                                          setFieldValue(
                                            `variants.${index}.isVolumeChecked`,
                                            checked
                                          );
                                          if (!checked) {
                                            setFieldValue(
                                              `variants.${index}.volume`,
                                              ""
                                            );
                                          }
                                        }}
                                      />
                                      <Label
                                        htmlFor={`isVolumeChecked-${index}`}
                                      >
                                        Volume
                                      </Label>
                                    </div>
                                  </div>
                                  {values.variants[index].isColorChecked && (
                                    <div>
                                      <Label
                                        htmlFor={`variants.${index}.color`}
                                      >
                                        Color
                                      </Label>
                                      <Field
                                        name={`variants.${index}.color`}
                                        as={Input}
                                      />
                                      {errors.variants?.[index]?.color &&
                                        touched.variants?.[index]?.color && (
                                          <div className="text-red-500">
                                            {errors.variants[index].color}
                                          </div>
                                        )}
                                    </div>
                                  )}
                                  {values.variants[index].isVolumeChecked && (
                                    <div>
                                      <Label
                                        htmlFor={`variants.${index}.volume`}
                                      >
                                        Volume
                                      </Label>
                                      <Field
                                        name={`variants.${index}.volume`}
                                        as={Input}
                                      />
                                      {errors.variants?.[index]?.volume &&
                                        touched.variants?.[index]?.volume && (
                                          <div className="text-red-500">
                                            {errors.variants[index].volume}
                                          </div>
                                        )}
                                    </div>
                                  )}
                                  <div>
                                    <Label htmlFor={`variants.${index}.label`}>
                                      Label
                                    </Label>
                                    <Field
                                      name={`variants.${index}.label`}
                                      as={Input}
                                    />
                                    {errors.variants?.[index]?.label &&
                                      touched.variants?.[index]?.label && (
                                        <div className="text-red-500">
                                          {errors.variants[index].label}
                                        </div>
                                      )}
                                  </div>
                                  <div>
                                    <Label htmlFor={`variants.${index}.value`}>
                                      Value
                                    </Label>
                                    <Field
                                      name={`variants.${index}.value`}
                                      as={Input}
                                    />
                                    {errors.variants?.[index]?.value &&
                                      touched.variants?.[index]?.value && (
                                        <div className="text-red-500">
                                          {errors.variants[index].value}
                                        </div>
                                      )}
                                  </div>
                                  <div>
                                    <Label htmlFor={`variants.${index}.price`}>
                                      Price
                                    </Label>
                                    <Field
                                      name={`variants.${index}.price`}
                                      type="number"
                                      as={Input}
                                    />
                                    {errors.variants?.[index]?.price &&
                                      touched.variants?.[index]?.price && (
                                        <div className="text-red-500">
                                          {errors.variants[index].price}
                                        </div>
                                      )}
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="mt-2"
                                  >
                                    Remove Variant
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                onClick={() =>
                                  push({
                                    color: "",
                                    volume: "",
                                    label: "",
                                    value: "",
                                    price: 0,
                                    isColorChecked: false,
                                    isVolumeChecked: false,
                                  })
                                }
                                className="mt-4"
                              >
                                Add Variant
                              </Button>
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      <div>
                        <Label htmlFor="inStock">Stock</Label>
                        <Field name="inStock" type="number" as={Input} />
                        {errors.inStock && touched.inStock && (
                          <div className="text-red-500">{errors.inStock}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="subCategory">Subcategory</Label>
                        <Field
                          name="subCategory"
                          as="select"
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((subcategory) => (
                            <option
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.name}
                            </option>
                          ))}
                        </Field>
                        {errors.subCategory && touched.subCategory && (
                          <div className="text-red-500">
                            {errors.subCategory}
                          </div>
                        )}
                      </div>

                      <Button type="submit">
                        {id ? "Update Product" : "Add Product"}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
