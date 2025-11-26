'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Product, ProductFilters, PaginatedResponse } from '../types';

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchNewProducts: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(async (filters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category.toString());
      if (filters?.brand) params.append('brand', filters.brand.toString());
      if (filters?.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString());
      if (filters?.is_new !== undefined) params.append('is_new', filters.is_new.toString());
      if (filters?.in_stock !== undefined) params.append('in_stock', filters.in_stock.toString());
      if (filters?.low_stock !== undefined) params.append('low_stock', filters.low_stock.toString());
      if (filters?.min_price) params.append('min_price', filters.min_price.toString());
      if (filters?.max_price) params.append('max_price', filters.max_price.toString());
      if (filters?.ordering) params.append('ordering', filters.ordering);

      const queryString = params.toString();
      const url = `/products/products/${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<PaginatedResponse<Product>>(url);
      setProducts(response.data.results);
      setTotalCount(response.data.count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>('/products/products/featured/');
      setProducts(response.data.results);
      setTotalCount(response.data.count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured products';
      setError(errorMessage);
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNewProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>('/products/products/new_arrivals/');
      setProducts(response.data.results);
      setTotalCount(response.data.count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch new products';
      setError(errorMessage);
      console.error('Error fetching new products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductBySlug = useCallback(async (slug: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Product>(`/products/products/${slug}/`);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      console.error('Error fetching product:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    totalCount,
    fetchProducts,
    fetchFeaturedProducts,
    fetchNewProducts,
    fetchProductBySlug,
  };
}
