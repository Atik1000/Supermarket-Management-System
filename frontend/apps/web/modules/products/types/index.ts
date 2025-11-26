export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number | null;
  image?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
  product_count?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string | null;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  price_adjustment: string;
  stock_quantity: number;
  is_active: boolean;
  is_default: boolean;
  final_price: string;
  is_in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  category: number | Category;
  category_name?: string;
  brand?: number | Brand | null;
  brand_name?: string;
  description?: string;
  short_description?: string;
  cost_price: string;
  selling_price: string;
  discount_price?: string | null;
  final_price: string;
  discount_percentage: number;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  is_in_stock: boolean;
  is_low_stock: boolean;
  weight?: string | null;
  dimensions?: string;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  primary_image?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  search?: string;
  category?: number;
  brand?: number;
  is_featured?: boolean;
  is_new?: boolean;
  in_stock?: boolean;
  low_stock?: boolean;
  min_price?: number;
  max_price?: number;
  ordering?: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  barcode?: string;
  category: number;
  brand?: number | null;
  description?: string;
  short_description?: string;
  cost_price: string;
  selling_price: string;
  discount_price?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  weight?: string;
  dimensions?: string;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
