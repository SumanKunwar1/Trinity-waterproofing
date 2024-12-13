import React from "react";

interface ProductDescriptionProps {
  features: string[];
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  features,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Product Details</h2>
      <ul className="list-disc list-inside text-gray-600">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDescription;
