export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Construction Chemicals",
    description: "High-quality waterproofing solutions for construction",
    image: "/placeholder.svg?height=200&width=300",
    subcategories: [
      { id: 101, name: "Concrete Waterproofing" },
      { id: 102, name: "Sealants" },
      { id: 103, name: "Admixtures" },
    ],
  },
  {
    id: 2,
    name: "Coatings",
    description: "Protective waterproof coatings for various surfaces",
    image: "/placeholder.svg?height=200&width=300",
    subcategories: [
      { id: 201, name: "Roof Coatings" },
      { id: 202, name: "Wall Coatings" },
      { id: 203, name: "Floor Coatings" },
    ],
  },
  {
    id: 3,
    name: "Membranes",
    description: "Waterproof membranes for roofing and foundations",
    image: "/placeholder.svg?height=200&width=300",
    subcategories: [
      { id: 301, name: "Sheet Membranes" },
      { id: 302, name: "Liquid Membranes" },
      { id: 303, name: "Self-Adhesive Membranes" },
    ],
  },
  {
    id: 4,
    name: "Drainage Systems",
    description: "Efficient water drainage solutions",
    image: "/placeholder.svg?height=200&width=300",
    subcategories: [
      { id: 401, name: "French Drains" },
      { id: 402, name: "Trench Drains" },
      { id: 403, name: "Sump Pumps" },
    ],
  },
  {
    id: 5,
    name: "Drainage Systems",
    description: "Efficient water drainage solutions",
    image: "/placeholder.svg?height=200&width=300",
    subcategories: [
      { id: 401, name: "French Drains" },
      { id: 402, name: "Trench Drains" },
      { id: 403, name: "Sump Pumps" },
    ],
  },
  {
    id: 6,
    name: "Drainage Systems",
    description: "Efficient water drainage solutions",
    image: "/placeholder.svg?height=200&width=300",
    subcategories: [
      { id: 401, name: "French Drains" },
      { id: 402, name: "Trench Drains" },
      { id: 403, name: "Sump Pumps" },
    ],
  },
];
