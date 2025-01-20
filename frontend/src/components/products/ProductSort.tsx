import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ProductSortProps {
  onSort: (option: string) => void;
}

const ProductSort: React.FC<ProductSortProps> = ({ onSort }) => {
  return (
    <div className="mb-8">
      <label
        htmlFor="sort"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Sort by:
      </label>
      <Select onValueChange={onSort}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
          <SelectItem value="name_asc">Name: A to Z</SelectItem>
          <SelectItem value="name_desc">Name: Z to A</SelectItem>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
          <SelectItem value="discount_desc">Biggest Discount</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;
