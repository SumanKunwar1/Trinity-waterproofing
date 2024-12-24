import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  //const isEditingImages = location.pathname.includes("edit-product-images"); // Removed

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
    fetchBrands();
    fetchSubCategories();
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  // Fetch functions remain the same...
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
      toast.error("Failed to fetch brands");
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
      toast.error("Failed to fetch subcategories");
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

      // Ensure colors are properly formatted when fetching existing product
      const featuresString = productData.features.join("\n");
      const formattedColors = Array.isArray(productData.colors)
        ? productData.colors.map((color: any) => ({
            name: color.name || "",
            hex: color.hex || "#000000",
          }))
        : [];

      setFormData({
        ...productData,
        colors: formattedColors,
        features: featuresString,
        productImage: null,
        image: [],
      });
    } catch (error) {
      toast.error("Failed to fetch product");
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (value: string) => {
    setFormData((prev) => ({ ...prev, features: value }));
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorInput(e.target.value);
  };

  const addColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: color, hex: color }],
    }));
    setShowColorPicker(false);
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const openColorPicker = () => {
    setShowColorPicker(true);
  };

  const closeColorPicker = () => {
    setShowColorPicker(false);
  };

  // Handle image changes
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productFormData = new FormData();

    if (formData.colors.length > 0) {
      productFormData.append("colors", JSON.stringify(formData.colors));
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "colors") return;

      if (key === "productImage" && value instanceof File) {
        productFormData.append(key, value);
      } else if (key === "image" && Array.isArray(value)) {
        value.forEach((image) => {
          if (image instanceof File) {
            productFormData.append("image", image);
          }
        });
      } else if (value !== null && value !== undefined) {
        productFormData.append(key, String(value));
      }
    });

    try {
      const url = id ? `/api/product/${id}` : "/api/product";
      const method = id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: productFormData,
      });

      if (!response.ok) throw new Error("Failed to submit product");

      toast.success(
        id ? "Product updated successfully" : "Product created successfully"
      );
      navigate("/admin/products");
    } catch (error) {
      toast.error(id ? "Failed to update product" : "Failed to create product");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Rest of the component remains the same...
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
                        <Label htmlFor="productImage">Main Product Image</Label>
                        <Input
                          id="productImage"
                          name="productImage"
                          type="file"
                          onChange={(e) => handleImageChange(e, true)}
                          accept="image/*"
                        />
                        {formData.productImage && (
                          <img
                            src={URL.createObjectURL(formData.productImage)}
                            alt="Product preview"
                            className="mt-2 w-32 h-32 object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="image">Additional Images</Label>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          onChange={(e) => handleImageChange(e, false)}
                          accept="image/*"
                          multiple
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.image.map((image, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(image)}
                              alt={`Product image ${index + 1}`}
                              className="w-24 h-24 object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="features">Features</Label>
                    <Editor
                      value={formData.features}
                      onChange={handleFeaturesChange}
                    />
                  </div>
                  {/* Colors section */}
                  <div>
                    <Label>Colors</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        type="button"
                        onClick={openColorPicker}
                        size="sm"
                        variant="secondary"
                      >
                        <FaPlus /> Add Color
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
                            onClick={() => removeColor(index)}
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
                        <Button
                          type="button"
                          onClick={() => addColor(colorInput)}
                          className="mt-2"
                        >
                          Add Color
                        </Button>
                        <Button
                          type="button"
                          onClick={closeColorPicker}
                          className="mt-2 ml-2"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button type="submit">
                    {id ? "Update Product" : "Create Product"}
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
