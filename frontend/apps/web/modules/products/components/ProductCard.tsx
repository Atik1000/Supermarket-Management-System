'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discount_percentage > 0;
  const imageUrl = product.primary_image || '/placeholder-product.png';

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <Badge variant="info" size="sm">New</Badge>
          )}
          {product.is_featured && (
            <Badge variant="warning" size="sm">Featured</Badge>
          )}
          {hasDiscount && (
            <Badge variant="error" size="sm">-{product.discount_percentage}%</Badge>
          )}
        </div>

        {/* Stock Status */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="error">Out of Stock</Badge>
          </div>
        )}
        {product.is_low_stock && product.is_in_stock && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="warning" size="sm">Low Stock</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          {product.category_name && (
            <span>{product.category_name}</span>
          )}
          {product.category_name && product.brand_name && (
            <span>•</span>
          )}
          {product.brand_name && (
            <span>{product.brand_name}</span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.final_price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ${product.selling_price}
            </span>
          )}
        </div>

        {/* SKU */}
        <div className="mt-2 text-xs text-gray-400">
          SKU: {product.sku}
        </div>
      </div>
    </Link>
  );
}
