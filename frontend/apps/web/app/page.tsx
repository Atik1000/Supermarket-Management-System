'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProducts } from '@/modules/products';
import { ProductGrid } from '@/modules/products';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const { products, loading, fetchFeaturedProducts } = useProducts();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          {/* Header Nav */}
          <div className="flex justify-end mb-8">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">Welcome, {user?.first_name || user?.username}!</span>
                {(user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'manager') && (
                  <Link
                    href="/admin/users"
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Profile
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-transparent border-2 border-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to Our Supermarket
            </h1>
            <p className="text-xl mb-8">
              Fresh groceries delivered to your doorstep
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/register"
                  className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {products.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link 
              href="/products" 
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          <ProductGrid products={products.slice(0, 4)} loading={loading} />
        </div>
      )}

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">Thousands of products to choose from</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Same-day delivery available</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">Multiple payment options</p>
          </div>
        </div>
      </div>
    </div>
  );
}
