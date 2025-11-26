'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Brand, PaginatedResponse } from '../types';

export interface UseBrandsResult {
  brands: Brand[];
  loading: boolean;
  error: string | null;
  fetchBrands: () => Promise<void>;
  fetchBrandBySlug: (slug: string) => Promise<Brand | null>;
}

export function useBrands(): UseBrandsResult {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PaginatedResponse<Brand>>('/products/brands/');
      setBrands(response.data.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brands';
      setError(errorMessage);
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBrandBySlug = useCallback(async (slug: string): Promise<Brand | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Brand>(`/products/brands/${slug}/`);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brand';
      setError(errorMessage);
      console.error('Error fetching brand:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    fetchBrandBySlug,
  };
}
