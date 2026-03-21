'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import ProductCard from '@/components/product/ProductCard';
import { Product, Category } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import api from '@/lib/api';

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { isEnglish } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, allRes] = await Promise.all([
                    api.get(`/products/category/${slug}`),
                    api.get('/products').catch(() => ({ data: { data: { products: [] } } })),
                ]);
                setProducts(catRes.data?.data?.products || []);
                setCategory(catRes.data?.data?.category || null);
                setAllProducts(allRes.data?.data?.products || []);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    // "You May Also Like" products — from other categories
    const alsoLike = allProducts
        .filter(p => p.categoryId !== category?.id && p.isActive)
        .slice(0, 8);

    return (
        <div className="pt-8 md:pt-12 pb-24 bg-[#FAF8F5] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-left mb-8 md:mb-16 border-b border-[#E8E3DD] pb-6 md:pb-8 fade-in-up">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2A2626] mb-3 md:mb-4">
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

                {/* You May Also Like - Horizontal scroll carousel */}
                {!loading && alsoLike.length > 0 && (
                    <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-[#E8E3DD]">
                        <h2 className="text-[20px] md:text-[28px] font-serif font-bold text-[#2A2626] mb-6 md:mb-8">
                            You May Also Like
                        </h2>
                        <div
                            ref={scrollRef}
                            className="flex gap-3 md:gap-4 overflow-x-auto scroll-snap-x pb-4"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            {alsoLike.map((product) => (
                                <div
                                    key={product.id}
                                    className="snap-start shrink-0"
                                    style={{ width: 'calc(50% - 6px)', minWidth: '160px', maxWidth: '280px' }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
