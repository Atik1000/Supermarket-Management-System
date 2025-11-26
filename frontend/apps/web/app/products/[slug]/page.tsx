'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from '@/modules/products';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';
import { ErrorAlert } from '@/components/ui/Alert';
import type { Product, ProductVariant } from '@/modules/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const { loading, error, fetchProductBySlug } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductBySlug(slug);
      if (data) {
        setProduct(data);
        setSelectedImage(data.primary_image || null);
        
        // Set default variant
        const defaultVariant = data.variants?.find(v => v.is_default);
        if (defaultVariant) {
          setSelectedVariant(defaultVariant);
        }
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug, fetchProductBySlug]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <ErrorAlert message={error} />
          <Button onClick={() => router.push('/products')} className="mt-4 w-full">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount_percentage > 0;
  const displayPrice = selectedVariant?.final_price || product.final_price;
  const displayStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const isInStock = selectedVariant?.is_in_stock ?? product.is_in_stock;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <button onClick={() => router.push('/products')} className="text-blue-600 hover:underline">
                Products
              </button>
            </li>
            <li className="text-gray-400">/</li>
            {typeof product.category === 'object' && (
              <>
                <li className="text-gray-600">{product.category.name}</li>
                <li className="text-gray-400">/</li>
              </>
            )}
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg p-8">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
              <Image
                src={selectedImage || '/placeholder-product.png'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && <Badge variant="info">New</Badge>}
                {product.is_featured && <Badge variant="warning">Featured</Badge>}
                {hasDiscount && <Badge variant="error">-{product.discount_percentage}%</Badge>}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === img.image ? 'border-blue-600' : 'border-gray-200'
                    } hover:border-blue-400 transition-colors`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img.image}
                        alt={img.alt_text || product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                {typeof product.category === 'object' && (
                  <span>{product.category.name}</span>
                )}
                {typeof product.brand === 'object' && product.brand && (
                  <>
                    <span>•</span>
                    <span>{product.brand.name}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.short_description}</p>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">${displayPrice}</span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.selling_price}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">SKU: {product.sku}</p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Variant
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.is_in_stock}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : variant.is_in_stock
                          ? 'border-gray-300 hover:border-gray-400'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {variant.name}
                      {!variant.is_in_stock && (
                        <span className="block text-xs mt-1">Out of Stock</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {isInStock ? (
                <Badge variant="success">In Stock ({displayStock} available)</Badge>
              ) : (
                <Badge variant="error">Out of Stock</Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <Button size="lg" className="flex-1" disabled={!isInStock}>
                Add to Cart
              </Button>
              <Button size="lg" variant="secondary">
                Add to Wishlist
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div className="pt-6 border-t mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h2>
              <dl className="space-y-2">
                {product.weight && (
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Weight:</dt>
                    <dd className="text-gray-900">{product.weight} kg</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Dimensions:</dt>
                    <dd className="text-gray-900">{product.dimensions}</dd>
                  </div>
                )}
                {product.barcode && (
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Barcode:</dt>
                    <dd className="text-gray-900">{product.barcode}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
