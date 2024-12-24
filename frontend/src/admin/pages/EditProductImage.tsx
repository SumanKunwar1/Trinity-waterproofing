import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTimes, FaPlus } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface ProductImages {
  productImage: string;
  image: string[];
}

const EditProductImages: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [productImages, setProductImages] = useState<ProductImages>({
    productImage: "",
    image: [],
  });
  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [newAdditionalImages, setNewAdditionalImages] = useState<File[]>([]);

  useEffect(() => {
    if (id) {
      fetchProductImages(id);
    }
  }, [id]);

  const fetchProductImages = async (productId: string) => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch product images");
      const productData = await response.json();
      console.log(productData, productData.productImage, productData.image);
      setProductImages({
        productImage: productData.productImage,
        image: productData.image,
      });
    } catch (error) {
      toast.error("Failed to fetch product images");
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMainImage: boolean
  ) => {
    const files = e.target.files;
    if (files) {
      if (isMainImage) {
        setNewMainImage(files[0]);
      } else {
        setNewAdditionalImages((prev) => [...prev, ...Array.from(files)]);
      }
    }
  };

  const removeMainImage = () => {
    setProductImages((prev) => ({ ...prev, productImage: "" }));
  };

  const removeAdditionalImage = (index: number) => {
    setProductImages((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const removeNewAdditionalImage = (index: number) => {
    setNewAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (newMainImage) {
      formData.append("productImage", newMainImage);
    }

    if (newAdditionalImages.length > 0) {
      newAdditionalImages.forEach((image) => {
        formData.append("image", image);
      });
    }

    try {
      const response = await fetch(`/api/product/image/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update product images");

      toast.success("Product images updated successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to update product images");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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
                <CardTitle className="text-2xl font-bold">
                  Edit Product Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex">
                    <div className="w-1/2 pr-4">
                      <Label>Current Images</Label>
                      <div className="mt-2 space-y-4">
                        <div className="relative">
                          <img
                            src={`${productImages.productImage}`}
                            alt="Main product"
                            className="w-full h-64 object-cover"
                          />
                          <Button
                            type="button"
                            onClick={removeMainImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            size="sm"
                          >
                            <FaTimes />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {productImages.image.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={`${image}`}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <Button
                                type="button"
                                onClick={() => removeAdditionalImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                size="sm"
                              >
                                <FaTimes />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 pl-4">
                      <Label>Add New Images</Label>
                      <div className="mt-2 space-y-4">
                        <div className="relative">
                          <Input
                            id="newMainImage"
                            name="newMainImage"
                            type="file"
                            onChange={(e) => handleImageChange(e, true)}
                            accept="image/*"
                            className="hidden"
                          />
                          <Label
                            htmlFor="newMainImage"
                            className="flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                          >
                            {newMainImage ? (
                              <img
                                src={URL.createObjectURL(newMainImage)}
                                alt="New main product"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaPlus className="text-4xl text-gray-400" />
                            )}
                          </Label>
                          {newMainImage && (
                            <Button
                              type="button"
                              onClick={() => setNewMainImage(null)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                              size="sm"
                            >
                              <FaTimes />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {newAdditionalImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`New product image ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <Button
                                type="button"
                                onClick={() => removeNewAdditionalImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                size="sm"
                              >
                                <FaTimes />
                              </Button>
                            </div>
                          ))}
                          <div className="relative">
                            <Input
                              id="newAdditionalImages"
                              name="newAdditionalImages"
                              type="file"
                              onChange={(e) => handleImageChange(e, false)}
                              accept="image/*"
                              multiple
                              className="hidden"
                            />
                            <Label
                              htmlFor="newAdditionalImages"
                              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                            >
                              <FaPlus className="text-2xl text-gray-400" />
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button type="submit">Update Images</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditProductImages;
