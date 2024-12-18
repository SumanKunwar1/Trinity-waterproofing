import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import RelatedProducts from "../components/product/RelatedProducts";
import TestimonialCard from "../components/common/TestimonialCard";
import { products } from "../constants/products"; // Import products from your local data
import { Product } from "../types/product"; // Assuming you're importing the Product type
import ProductDescription from "../components/common/ProductDescription";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]); // Reviews state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch product details from the local products data
  useEffect(() => {
    const fetchProductAndReviews = () => {
      const productData = products.find(
        (product) => product.id === parseInt(id) // Match product by ID
      );
      if (productData) {
        setProduct(productData);
        setReviews(productData.reviews); // Set reviews from product data
        setLoading(false);
      } else {
        setError("Product not found");
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 ">
          <div className=" bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row py-3 px-6">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <ProductGallery
                  images={[product.productImage, ...product.image]}
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-8">
                <ProductInfo product={product} />
              </div>
            </div>
            <div className="mb-16 py-3 px-6">
              {/* Product Description Component */}
              <ProductDescription features={product.features} />
            </div>
          </div>

          {/* Pass reviews to TestimonialCard */}
          {reviews.length > 0 ? (
            <TestimonialCard reviews={reviews} />
          ) : (
            <div>No reviews yet</div>
          )}

          <RelatedProducts
            currentProductId={product.id}
            categoryId={product.categoryId}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
