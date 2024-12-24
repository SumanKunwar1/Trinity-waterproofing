import React from "react";

interface ProductDescriptionProps {
  features: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  features,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Product Details</h2>
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{ __html: features }}
      />
    </div>
  );
};

export default ProductDescription;
