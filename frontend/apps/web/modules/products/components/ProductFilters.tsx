'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ProductFilters as ProductFiltersType, Category, Brand } from '../types';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  onFilterChange: (filters: ProductFiltersType) => void;
  loading?: boolean;
}

export function ProductFilters({ 
  categories, 
  brands, 
  onFilterChange,
  loading = false
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchInput || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { 
      ...filters, 
      category: categoryId ? parseInt(categoryId) : undefined 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (brandId: string) => {
    const newFilters = { 
      ...filters, 
      brand: brandId ? parseInt(brandId) : undefined 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };



  const handleCheckboxChange = (key: keyof ProductFiltersType, value: boolean) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleOrderingChange = (ordering: string) => {
    const newFilters = { ...filters, ordering: ordering || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchInput('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" size="sm" disabled={loading}>
              Search
            </Button>
          </form>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={loading}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.brand || ''}
            onChange={(e) => handleBrandChange(e.target.value)}
            disabled={loading}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.ordering || ''}
            onChange={(e) => handleOrderingChange(e.target.value)}
            disabled={loading}
          >
            <option value="">Default</option>
            <option value="name">Name (A-Z)</option>
            <option value="-name">Name (Z-A)</option>
            <option value="selling_price">Price (Low to High)</option>
            <option value="-selling_price">Price (High to Low)</option>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={filters.is_featured || false}
              onChange={(e) => handleCheckboxChange('is_featured', e.target.checked)}
              disabled={loading}
            />
            <span className="ml-2 text-sm text-gray-700">Featured Only</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={filters.is_new || false}
              onChange={(e) => handleCheckboxChange('is_new', e.target.checked)}
              disabled={loading}
            />
            <span className="ml-2 text-sm text-gray-700">New Arrivals</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={filters.in_stock || false}
              onChange={(e) => handleCheckboxChange('in_stock', e.target.checked)}
              disabled={loading}
            />
            <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
