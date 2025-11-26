'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Category, PaginatedResponse } from '../types';

export interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchRootCategories: () => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<Category | null>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PaginatedResponse<Category>>('/products/categories/');
      setCategories(response.data.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRootCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Category[]>('/products/categories/root/');
      setCategories(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch root categories';
      setError(errorMessage);
      console.error('Error fetching root categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoryBySlug = useCallback(async (slug: string): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Category>(`/products/categories/${slug}/`);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
      setError(errorMessage);
      console.error('Error fetching category:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchRootCategories,
    fetchCategoryBySlug,
  };
}
