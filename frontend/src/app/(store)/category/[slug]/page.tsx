'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import { Product, Category } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import api from '@/lib/api';

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { isEnglish } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/products/category/${slug}`);
                setProducts(res.data?.data?.products || []);
                setCategory(res.data?.data?.category || null);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold text-[--color-brown] mb-2">
                        {category ? (isEnglish ? category.name : category.nameTa) : slug}
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-[--color-primary] to-[--color-secondary] mx-auto rounded-full" />
                    {category?._count && (
                        <p className="text-[--color-brown]/50 mt-3">
                            {category._count.products} {isEnglish ? 'products' : 'பொருட்கள்'}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[--color-cream] border-t-[--color-primary] rounded-full animate-spin" />
                    </div>
                ) : (
                    <ProductGrid products={products} />
                )}
            </div>
        </div>
    );
}
