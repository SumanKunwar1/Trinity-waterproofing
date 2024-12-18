import { Product } from "./../types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Concrete Waterproofing Solution",
    description: "High-quality waterproofing solution for concrete structures.",
    retailPrice: 49.99,
    wholeSalePrice: 39.99,
    productImage:
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    image: [
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
      "/assets/waterproofing-1.png",
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    ],
    categoryId: 1,
    subcategoryId: 101,
    averageRating: 4.5,
    ratingCount: 30,
    features: [
      "Deep penetration into concrete",
      "Long-lasting protection",
      "Easy to apply",
      "Suitable for both new and old concrete",
    ],
    brand: "ConcretePro",
    variants: [
      { color: "Clear", volume: "1L", price: 49.99 },
      { color: "Clear", volume: "5L", price: 239.99 },
      { color: "Maroon", volume: "10L", price: 469.99 },
    ],
    inStock: 150, // Available in stock
    reviews: [
      {
        id: "1",
        name: "John Doe",
        content:
          "Great product! It worked as advertised and provided excellent waterproofing.",
        rating: 5,
        date: new Date("2024-11-15T10:00:00Z").toLocaleDateString(),
      },
      {
        id: "2",
        name: "Jane Smith",
        content:
          "Good quality, but the price is a bit high. Still, it’s effective.",
        rating: 4,
        date: new Date("2024-11-10T15:30:00Z").toLocaleDateString(),
      },
    ],
  },
  {
    id: 2,
    name: "Advanced Roof Coating",
    description:
      "Durable roof coating that provides excellent waterproofing and UV protection.",
    retailPrice: 89.99,
    wholeSalePrice: 79.99,
    productImage:
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    image: [
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
      "/assets/waterproofing-1.png",
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    ],
    categoryId: 2,
    subcategoryId: 201,
    averageRating: 4,
    ratingCount: 25,
    features: [
      "Extends roof life",
      "Reflects UV rays",
      "Reduces energy costs",
      "Easy to apply",
    ],
    brand: "RoofShield",
    variants: [
      { color: "White", volume: "1L", price: 89.99 },
      { color: "White", volume: "5L", price: 419.99 },
      { color: "Gray", volume: "10L", price: 849.99 },
    ],
    inStock: 100, // Available in stock
    reviews: [
      {
        id: "3",
        name: "Alice Brown",
        content:
          "Great for UV protection, but not as effective for waterproofing as I expected.",
        rating: 3,
        date: new Date("2024-11-20T12:00:00Z").toLocaleDateString(),
      },
      {
        id: "4",
        name: "Robert Green",
        content:
          "Worked well on my roof, but the white color gets dirty quickly.",
        rating: 4,
        date: new Date("2024-11-18T10:00:00Z").toLocaleDateString(),
      },
    ],
  },
  {
    id: 3,
    name: "Flexible Sheet Membrane",
    description:
      "High-performance waterproof sheet membrane for foundations and basements.",
    retailPrice: 149.99,
    wholeSalePrice: 139.99,
    productImage:
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    image: [
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
      "/assets/waterproofing-1.png",
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    ],
    categoryId: 3,
    subcategoryId: 301,
    averageRating: 3.5,
    ratingCount: 15,
    features: [
      "Highly flexible",
      "Crack-bridging ability",
      "Root resistant",
      "Long service life",
    ],
    brand: "FlexSeal",
    variants: [
      { color: "Black", volume: "1.5mm", price: 149.99 },
      { color: "Black", volume: "2mm", price: 199.99 },
      { color: "Gray", volume: "3mm", price: 249.99 },
    ],
    inStock: 80, // Available in stock
    reviews: [
      {
        id: "5",
        name: "Mark Wilson",
        content:
          "Good product, but not as durable as I expected. Some minor issues with flexibility.",
        rating: 3,
        date: new Date("2024-11-17T16:00:00Z").toLocaleDateString(),
      },
      {
        id: "6",
        name: "Lily Carter",
        content:
          "It worked well for my basement, but I had to use additional layers.",
        rating: 4,
        date: new Date("2024-11-10T09:00:00Z").toLocaleDateString(),
      },
    ],
  },
  {
    id: 4,
    name: "Smart French Drain System",
    description:
      "Innovative French drain system that efficiently manages water flow and prevents water damage.",
    retailPrice: 149.99,
    wholeSalePrice: 129.99,
    productImage:
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    image: [
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
      "/assets/waterproofing-1.png",
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    ],
    categoryId: 4,
    subcategoryId: 401,
    averageRating: 4.5,
    ratingCount: 40,
    features: [
      "Easy installation",
      "Modular design",
      "High flow capacity",
      "Durable materials",
    ],
    brand: "DrainTech",
    variants: [
      { color: "Black", volume: "2m Length", price: 199.99 },
      { color: "Black", volume: "3m Length", price: 299.99 },
      { color: "Gray", volume: "5m Length", price: 499.99 },
    ],
    inStock: 120, // Available in stock
    reviews: [
      {
        id: "7",
        name: "Samuel Mitchell",
        content:
          "Easy to install, and it works great for managing water flow. Highly recommend.",
        rating: 5,
        date: new Date("2024-11-22T11:30:00Z").toLocaleDateString(),
      },
      {
        id: "8",
        name: "Emily Davis",
        content:
          "Excellent drainage system. The modular design makes it easy to expand.",
        rating: 5,
        date: new Date("2024-11-19T08:15:00Z").toLocaleDateString(),
      },
    ],
  },
  {
    id: 5,
    name: "Elastomeric Wall Coating",
    description:
      "Flexible and durable wall coating for waterproofing and protection.",
    retailPrice: 69.99,
    wholeSalePrice: 49.99,
    productImage:
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    image: [],
    categoryId: 2,
    subcategoryId: 202,
    averageRating: 4,
    ratingCount: 20,
    features: [
      "Bridges hairline cracks",
      "Breathable membrane",
      "UV resistant",
      "Long-lasting protection",
    ],
    brand: "WallGuard",
    variants: [
      { color: "White", volume: "5L", price: 69.99 },
      { color: "Gray", volume: "10L", price: 129.99 },
      { color: "Beige", volume: "10L", price: 139.99 },
    ],
    inStock: 60, // Available in stock
    reviews: [
      {
        id: "9",
        name: "Chris James",
        content:
          "Perfect for my exterior walls. The coating is durable and protects well from the weather.",
        rating: 4,
        date: new Date("2024-11-25T13:45:00Z").toLocaleDateString(),
      },
      {
        id: "10",
        name: "Natalie Brown",
        content: "Good coverage but took longer to dry than I expected.",
        rating: 3,
        date: new Date("2024-11-15T14:30:00Z").toLocaleDateString(),
      },
    ],
  },
  {
    id: 6,
    name: "Self-Adhesive Roofing Membrane",
    description:
      "Easy-to-install self-adhesive membrane for roof waterproofing.",
    retailPrice: 49.99,
    wholeSalePrice: 39.99,
    productImage:
      "https://hardwarepasal.com/src/img/product/2024-07-12-15-07-35_zWMABNsiGXproduct.jpeg",
    image: [],
    categoryId: 3,
    subcategoryId: 303,
    averageRating: 3,
    ratingCount: 10,
    features: [
      "No torch required",
      "Excellent adhesion",
      "UV stable",
      "Puncture resistant",
    ],
    brand: "RoofStick",
    variants: [
      { color: "Black", volume: "1m x 10m Roll", price: 129.99 },
      { color: "Gray", volume: "1m x 15m Roll", price: 179.99 },
    ],
    inStock: 200, // Available in stock
    reviews: [
      {
        id: "11",
        name: "John Anderson",
        content:
          "Easy to apply but didn't hold as well on my roof. Needed more adhesive.",
        rating: 3,
        date: new Date("2024-11-12T17:00:00Z").toLocaleDateString(),
      },
      {
        id: "12",
        name: "Sophia Lee",
        content:
          "Not bad, but the rolls are smaller than expected. Coverage could be better.",
        rating: 3,
        date: new Date("2024-11-14T09:45:00Z").toLocaleDateString(),
      },
    ],
  },
];
