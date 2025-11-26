'use client';

import { useEffect } from 'react';
import { 
  useProducts, 
  useCategories, 
  useBrands, 
  ProductGrid, 
  ProductFilters,
  type ProductFiltersType 
} from '@/modules/products';
import { ErrorAlert } from '@/components/ui/Alert';

export default function ProductsPage() {
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    totalCount,
    fetchProducts 
  } = useProducts();
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError,
    fetchCategories 
  } = useCategories();
  
  const { 
    brands, 
    loading: brandsLoading, 
    error: brandsError,
    fetchBrands 
  } = useBrands();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  const handleFilterChange = (filters: ProductFiltersType) => {
    fetchProducts(filters);
  };

  const error = productsError || categoriesError || brandsError;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Browse our collection of {totalCount} products
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <ProductFilters
              categories={categories}
              brands={brands}
              onFilterChange={handleFilterChange}
              loading={productsLoading || categoriesLoading || brandsLoading}
            />
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            <ProductGrid 
              products={products} 
              loading={productsLoading}
              emptyMessage="No products found. Try adjusting your filters."
            />
          </main>
        </div>
      </div>
    </div>
  );
}
