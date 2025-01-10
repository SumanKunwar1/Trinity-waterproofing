import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
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
import Editor from "../components/Editor";
import { HexColorPicker } from "react-colorful";

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
  productImage: File | null;
  image: File[];
  features: string;
  brand: string;
  colors: Color[];
  inStock: number;
  subCategory: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    retailPrice: 0,
    wholeSalePrice: 0,
    productImage: null,
    image: [],
    features: "",
    brand: "",
    colors: [],
    inStock: 0,
    subCategory: "",
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
      if (!response.ok) throw new Error("Failed to fetch brands");
      const data = await response.json();
      setBrands(data);
    } catch (error) {
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
      if (!response.ok) throw new Error("Failed to fetch product");
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

      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        retailPrice: Number(productData.retailPrice) || 0,
        wholeSalePrice: Number(productData.wholeSalePrice) || 0,
        productImage: null,
        image: [],
        features: featuresString || "",
        brand: productData.brand || "",
        colors: formattedColors,
        inStock: Number(productData.inStock) || 0,
        subCategory: productData.subCategory || "",
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ["retailPrice", "wholeSalePrice", "inStock"];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (value: string) => {
    setFormData((prev) => ({ ...prev, features: value }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMainImage: boolean
  ) => {
    const files = e.target.files;
    if (files) {
      if (isMainImage) {
        setFormData((prev) => ({ ...prev, productImage: files[0] }));
      } else {
        setFormData((prev) => ({
          ...prev,
          image: [...prev.image, ...Array.from(files)],
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id ? `/api/product/${id}` : "/api/product";
      const method = id ? "PATCH" : "POST";

      // Prepare the request body based on the method (PATCH or POST)
      if (method === "PATCH") {
        // For PATCH request, we send the data as JSON
        const requestBody = {
          name: formData.name,
          description: formData.description,
          retailPrice: formData.retailPrice,
          wholeSalePrice: formData.wholeSalePrice,
          inStock: formData.inStock,
          brand: formData.brand,
          subCategory: formData.subCategory,
          features: formData.features,
          colors: formData.colors, // No need to stringify for JSON
        };

        // Log the request body for debugging
        console.log("Request Body for PATCH:", requestBody);

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json", // Send as JSON for PATCH
          },
          body: JSON.stringify(requestBody), // Convert to JSON string
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update product");
        }
      } else {
        // For POST request, we need to send the data as FormData
        const productFormData = new FormData();

        // Add basic fields
        productFormData.append("name", formData.name);
        productFormData.append("description", formData.description);
        productFormData.append("retailPrice", formData.retailPrice.toString());
        productFormData.append(
          "wholeSalePrice",
          formData.wholeSalePrice.toString()
        );
        productFormData.append("inStock", formData.inStock.toString());
        productFormData.append("brand", formData.brand);
        productFormData.append("subCategory", formData.subCategory);
        productFormData.append("features", formData.features);
        productFormData.append("colors", JSON.stringify(formData.colors)); // JSON.stringify for FormData

        // Only append images for new product creation (POST)
        if (formData.productImage) {
          productFormData.append("productImage", formData.productImage);
        }

        formData.image.forEach((file, index) => {
          productFormData.append(`image`, file);
        });

        // Log FormData contents for debugging
        for (let pair of productFormData.entries()) {
          console.log("data in productFormData", pair[0], pair[1]);
        }

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: productFormData, // Send FormData for POST
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create product");
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
      setLoading(false);
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="retailPrice">Retail Price</Label>
                    <Input
                      id="retailPrice"
                      name="retailPrice"
                      type="number"
                      value={formData.retailPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="wholeSalePrice">Wholesale Price</Label>
                    <Input
                      id="wholeSalePrice"
                      name="wholeSalePrice"
                      type="number"
                      value={formData.wholeSalePrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                      name="brand"
                      value={formData.brand}
                      onValueChange={(value) =>
                        handleSelectChange("brand", value)
                      }
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
                  </div>

                  <div>
                    <Label htmlFor="subCategory">Subcategory</Label>
                    <Select
                      name="subCategory"
                      value={formData.subCategory}
                      onValueChange={(value) =>
                        handleSelectChange("subCategory", value)
                      }
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
                  </div>

                  <div>
                    <Label htmlFor="inStock">In Stock</Label>
                    <Input
                      id="inStock"
                      name="inStock"
                      type="number"
                      value={formData.inStock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {!id && (
                    <>
                      <div>
                        <Label>Main Product Image</Label>
                        <Input
                          type="file"
                          onChange={(e) => handleImageChange(e, true)}
                          accept="image/*"
                          required
                        />
                      </div>

                      <div>
                        <Label>Additional Images</Label>
                        <Input
                          type="file"
                          onChange={(e) => handleImageChange(e, false)}
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
                      <Editor
                        value={formData.features}
                        onChange={handleFeaturesChange}
                      />
                    </div>
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
                      {formData.colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full cursor-pointer border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                          <Button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                colors: prev.colors.filter(
                                  (_, i) => i !== index
                                ),
                              }));
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
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: [
                                    ...prev.colors,
                                    { name: colorInput, hex: colorInput },
                                  ],
                                }));
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

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : id ? (
                      "Update Product"
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
