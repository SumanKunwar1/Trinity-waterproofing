import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import RelatedProducts from "../components/product/RelatedProducts";
import TestimonialCard from "../components/common/TestimonialCard";
import ProductDescription from "../components/common/ProductDescription";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { IProduct } from "../types/product";
import { Helmet } from "react-helmet";
import Loader from "../components/common/Loader";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      toast.success("Redirecting to checkout...");
    } catch (error) {
      toast.error("Failed to process the purchase. Please try again.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  if (!product) {
    return <div>Product not found</div>;
  }

  const productMetaDescription =
    product.description || "Check out this amazing product!";
  const productMetaKeywords = product.name
    ? product.name + ", shopping, buy"
    : "product, online store";
  console.log("product", product);
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Tinity Waterproofing - {product.name}</title>
        <meta name="description" content={productMetaDescription} />
        <meta name="keywords" content={productMetaKeywords} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={productMetaDescription} />
        <meta property="og:image" content={product.productImage} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row py-3 px-6">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <ProductGallery
                  images={[product.productImage, ...product.image]}
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-8">
                <ProductInfo product={product} onBuyNow={handleBuyNow} />
              </div>
            </div>
            <div className="mb-16 py-3 px-6">
              <ProductDescription features={product.features} />
            </div>
          </div>

          {product.review.length > 0 ? (
            <TestimonialCard reviews={product.review} />
          ) : (
            <div>No reviews yet</div>
          )}

          <RelatedProducts
            currentProductId={product._id}
            categoryId={product.subCategory}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
