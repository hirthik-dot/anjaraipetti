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
        <div className="pt-32 pb-24 bg-[#FAF8F5] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-left mb-16 border-b border-[#E8E3DD] pb-8 fade-in-up">
                    <h1 className="text-4xl sm:text-5xl font-serif text-[#2A2626] mb-4">
                        {category ? (isEnglish ? category.name : category.nameTa) : slug}
                    </h1>
                    
                    {category?._count && (
                        <p className="text-[14px] text-[#6B6363] tracking-wide">
                            {category._count.products} {isEnglish ? 'Products Available' : 'பொருட்கள்'}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="fade-in-up delay-1">
                        <ProductGrid products={products} />
                    </div>
                )}
            </div>
        </div>
    );
}
