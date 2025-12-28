'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  inventory: number;
  imageUrl: string;
  salesCount: number;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/shopify/products?topSelling=true&limit=30');
      if (res?.ok) {
        const data = await res.json();
        setProducts(data?.products ?? []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <p className="text-blue-200 mt-1">Top-selling products from your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all h-full">
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-slate-800">
                  <Image
                    src={product.imageUrl ?? ''}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  {product.salesCount > 400 && (
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Top Seller
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-white text-lg mb-2">
                  {product.title}
                </CardTitle>
                <CardDescription className="text-blue-200 text-sm mb-3 line-clamp-2">
                  {product.description}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-300">
                      {product.salesCount} sold
                    </p>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {product.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium">No products found</p>
            <p className="text-blue-200 text-sm mt-2">Sync products from your Shopify store</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
