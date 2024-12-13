import React from 'react';

interface ProductSortProps {
  onSort: (option: string) => void;
}

const ProductSort: React.FC<ProductSortProps> = ({ onSort }) => {
  return (
    <div className="mb-8">
      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
        Sort by:
      </label>
      <select
        id="sort"
        className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => onSort(e.target.value)}
      >
        <option value="">Default</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A to Z</option>
        <option value="name_desc">Name: Z to A</option>
      </select>
    </div>
  );
};

export default ProductSort;

