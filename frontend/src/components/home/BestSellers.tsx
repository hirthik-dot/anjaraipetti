'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

interface BestSellersProps {
    products: Product[];
}

export default function BestSellers({ products }: BestSellersProps) {
    const { t } = useLanguage();

    if (!products || products.length === 0) return null;

    return (
        <section className="section-padding bg-[#FFFFFF] border-y border-[#E8E3DD]" id="best-sellers">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6B6363] mb-3 block">
                            Curated Selection
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-[#2A2626]">
                            {t('bestSellers')}
                        </h2>
                    </div>

                    <Link href="/category/masala" className="text-[13px] font-medium text-[#8B1A1A] hover:text-[#C8962E] transition-colors pb-1 border-b border-transparent hover:border-[#C8962E] uppercase tracking-wider hidden md:block">
                        View Complete Collection
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="mt-12 text-center md:hidden">
                    <Link href="/category/masala" className="btn-outline w-full sm:w-auto">
                        View Complete Collection
                    </Link>
                </div>
            </div>
        </section>
    );
}
