import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { HexColorPicker } from "react-colorful";
import TinyMCEEditor from "../components/Editor";

interface Color {
  name: string;
  hex: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  retailPrice: number;
  wholeSalePrice: number;
  retailDiscountedPrice: number;
  wholeSaleDiscountedPrice: number;
  productImage: File | null;
  image: File[];
  features: string;
  brand: string;
  colors: Color[];
  inStock: number;
  pdfUrl: string;
  subCategory: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  retailPrice: Yup.number()
    .min(0, "Retail price must be at least 0")
    .required("Retail price is required"),
  wholeSalePrice: Yup.number()
    .min(0, "Wholesale price must be at least 0")
    .required("Wholesale price is required"),
  retailDiscountedPrice: Yup.number().min(
    0,
    "Retail discounted price must be at least 0"
  ),
  wholeSaleDiscountedPrice: Yup.number().min(
    0,
    "Wholesale discounted price must be at least 0"
  ),
  inStock: Yup.number()
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  brand: Yup.string().required("Brand is required"),
  subCategory: Yup.string().required("Subcategory is required"),
  features: Yup.string().required("Features are required"),
  colors: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Color name is required"),
      hex: Yup.string().required("Color hex is required"),
    })
  ),
  image: Yup.array().min(1, "At least one image is required"),
  pdfUrl: Yup.string().url("Invalid PDF URL"),
});

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Product ID:", id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [initialFormData, setInitialFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    retailPrice: 0,
    wholeSalePrice: 0,
    retailDiscountedPrice: 0,
    wholeSaleDiscountedPrice: 0,
    productImage: null,
    image: [],
    features: "",
    brand: "",
    colors: [],
    inStock: 0,
    subCategory: "",
    pdfUrl: "",
  });
  const [colorInput, setColorInput] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        await Promise.all([fetchBrands(), fetchSubCategories()]);
        if (id) {
          await fetchProduct(id);
        }
      } catch (error) {
        console.error("Error initializing form:", error);
        toast.error("Failed to initialize form");
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [id]);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brand", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch brands");
      }
      const data = await response.json();
      setBrands(data);
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch product");
      }
      const productData = await response.json();

      const featuresString = Array.isArray(productData.features)
        ? productData.features.join("\n")
        : productData.features;

      const formattedColors = Array.isArray(productData.colors)
        ? productData.colors.map((color: any) => ({
            name: color.name || "",
            hex: color.hex || "#000000",
          }))
        : [];

      setInitialFormData({
        name: productData.name || "",
        description: productData.description || "",
        retailPrice: Number(productData.retailPrice) || 0,
        wholeSalePrice: Number(productData.wholeSalePrice) || 0,
        retailDiscountedPrice: Number(productData.retailDiscountedPrice) || 0,
        wholeSaleDiscountedPrice:
          Number(productData.wholeSaleDiscountedPrice) || 0,
        productImage: null,
        image: [],
        features: featuresString || "",
        brand: productData.brand || "",
        colors: formattedColors,
        inStock: Number(productData.inStock) || 0,
        subCategory: productData.subCategory || "",
        pdfUrl: productData.pdfUrl || "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch product");
      throw error;
    }
  };

  const handleSubmit = async (
    values: ProductFormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);

    try {
      const url = id ? `/api/product/${id}` : "/api/product";
      const method = id ? "PATCH" : "POST";

      if (method === "PATCH") {
        const requestBody = {
          name: values.name,
          description: values.description,
          retailPrice: values.retailPrice,
          wholeSalePrice: values.wholeSalePrice,
          retailDiscountedPrice: values.retailDiscountedPrice,
          wholeSaleDiscountedPrice: values.wholeSaleDiscountedPrice,
          inStock: parseInt(values.inStock.toString(), 10),
          brand: values.brand,
          subCategory: values.subCategory,
          features: values.features,
          colors: values.colors,
          pdfUrl: values.pdfUrl,
        };

        console.log("Request Body for PATCH:", requestBody);

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update product");
        }
      } else {
        const productFormData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (key === "colors") {
            productFormData.append(key, JSON.stringify(value));
          } else if (key === "productImage" && value instanceof File) {
            productFormData.append(key, value);
          } else if (key === "image" && Array.isArray(value)) {
            value.forEach((file) => {
              productFormData.append(`image`, file);
            });
          } else {
            productFormData.append(key, String(value));
          }
        });

        for (let pair of productFormData.entries()) {
          console.log("data in productFormData", pair[0], pair[1]);
        }

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: productFormData,
        });

        if (!response.ok) {
          console.log("the response is not okay", response);
          const errorData = await response.json();
          console.log("we got the error", errorData);
          throw new Error(errorData.error || "Failed to create product");
        }
      }

      toast.success(
        id ? "Product updated successfully" : "Product created successfully"
      );
      navigate("/admin/products");
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
                <CardTitle className="text-2xl font-bold">
                  {id ? "Edit Product" : "Add New Product"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Formik
                  initialValues={initialFormData}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Field name="name" as={Input} />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Field name="description" as={Input} />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="retailPrice">Retail Price</Label>
                        <Field name="retailPrice" type="number" as={Input} />
                        <ErrorMessage
                          name="retailPrice"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="wholeSalePrice">Wholesale Price</Label>
                        <Field name="wholeSalePrice" type="number" as={Input} />
                        <ErrorMessage
                          name="wholeSalePrice"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="retailDiscountedPrice">
                          Retail Discounted Price
                        </Label>
                        <Field
                          name="retailDiscountedPrice"
                          type="number"
                          as={Input}
                        />
                        <ErrorMessage
                          name="retailDiscountedPrice"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="wholeSaleDiscountedPrice">
                          Wholesale Discounted Price
                        </Label>
                        <Field
                          name="wholeSaleDiscountedPrice"
                          type="number"
                          as={Input}
                        />
                        <ErrorMessage
                          name="wholeSaleDiscountedPrice"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pdfUrl">PDF URL</Label>
                        <Field name="pdfUrl" type="url" as={Input} />
                        <ErrorMessage
                          name="pdfUrl"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Field name="brand">
                          {({ field, form }: { field: any; form: any }) => (
                            <Select
                              onValueChange={(value) =>
                                form.setFieldValue(field.name, value)
                              }
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a brand" />
                              </SelectTrigger>
                              <SelectContent>
                                {brands.map((brand) => (
                                  <SelectItem key={brand._id} value={brand._id}>
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="brand"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subCategory">Subcategory</Label>
                        <Field name="subCategory">
                          {({ field, form }: { field: any; form: any }) => (
                            <Select
                              onValueChange={(value) =>
                                form.setFieldValue(field.name, value)
                              }
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subcategory" />
                              </SelectTrigger>
                              <SelectContent>
                                {subCategories.map((subCategory) => (
                                  <SelectItem
                                    key={subCategory._id}
                                    value={subCategory._id}
                                  >
                                    {subCategory.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="subCategory"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="inStock">In Stock</Label>
                        <Field
                          name="inStock"
                          type="number"
                          as={Input}
                          min="0"
                        />
                        <ErrorMessage
                          name="inStock"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      {!id && (
                        <>
                          <div>
                            <Label>Main Product Image</Label>
                            <Input
                              type="file"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setFieldValue("productImage", file);
                                }
                              }}
                              accept="image/*"
                            />
                          </div>

                          <div>
                            <Label>Additional Images</Label>
                            <Input
                              type="file"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                const files = e.target.files;
                                if (files) {
                                  setFieldValue("image", Array.from(files));
                                }
                              }}
                              accept="image/*"
                              multiple
                              className="mt-4"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <Label>Features</Label>
                        <div className="mt-2">
                          <Field name="features">
                            {({ field }: { field: any }) => (
                              <TinyMCEEditor
                                value={field.value}
                                onChange={(content: string) =>
                                  setFieldValue("features", content)
                                }
                                height={600}
                              />
                            )}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="features"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div>
                        <Label>Colors</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            type="button"
                            onClick={() => setShowColorPicker(true)}
                            size="sm"
                            variant="secondary"
                          >
                            <FaPlus className="mr-2" /> Add Color
                          </Button>
                        </div>
                        <div className="mt-2 space-y-2">
                          {values.colors.map((color, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="w-6 h-6 rounded-full cursor-pointer border border-gray-200"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span>{color.name}</span>
                              <Button
                                type="button"
                                onClick={() => {
                                  const newColors = [...values.colors];
                                  newColors.splice(index, 1);
                                  setFieldValue("colors", newColors);
                                }}
                                size="sm"
                                variant="destructive"
                              >
                                <FaTimes />
                              </Button>
                            </div>
                          ))}
                        </div>
                        {showColorPicker && (
                          <div className="mt-4">
                            <HexColorPicker
                              color={colorInput}
                              onChange={setColorInput}
                            />
                            <Input
                              type="text"
                              placeholder="Color name"
                              value={colorInput}
                              onChange={(e) => setColorInput(e.target.value)}
                              className="mt-2"
                            />
                            <div className="mt-2 space-x-2">
                              <Button
                                type="button"
                                onClick={() => {
                                  if (colorInput) {
                                    setFieldValue("colors", [
                                      ...values.colors,
                                      { name: colorInput, hex: colorInput },
                                    ]);
                                    setColorInput("");
                                    setShowColorPicker(false);
                                  }
                                }}
                              >
                                Add Color
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setShowColorPicker(false)}
                                variant="outline"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : id ? (
                          "Update Product"
                        ) : (
                          "Create Product"
                        )}
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
