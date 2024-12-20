export interface Product {
  id: number; // Unique identifier for the product
  name: string; // Name of the product
  description: string; // Detailed description of the product
  retailPrice: number; // Base price of the product
  wholeSalePrice: number; // Wholesale price of the product
  reviews: {
    id: string; // Unique identifier for the review
    name: string; // Name of the reviewer
    content: string; // Review text
    rating: number; // Rating value (1-5 stars)
    date: string; // ISO date string or timestamp of when the review was submitted
  }[]; // Array of reviews
  ratingCount: number; // Number of ratings
  averageRating: number; // Optional field to calculate the average rating
  productImage: string; // URL of the main product image
  image: string[]; // Array of additional image URLs
  categoryId: number; // ID of the category the product belongs to
  subcategoryId: number; // ID of the subcategory the product belongs to
  features: string[]; // Array of features or highlights of the product
  brand: string; // Brand name of the product
  variants: {
    color?: string; // Optional field for color of the variant
    volume?: string; // Optional field for volume (if applicable)
    label?: string; // Description of the variant, e.g., "Color: Red", "Size: 500ml"
    value?: string; // Specific value of the variant, e.g., "#FF0000" for color, "500ml" for size
    price: number; // Price of the specific variant
  }[]; // Array of product variants, including color, volume, and price
  inStock: number; // Number of items available in stock
}
