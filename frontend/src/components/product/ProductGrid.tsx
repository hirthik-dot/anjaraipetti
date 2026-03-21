'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
    title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-[#6B6363] text-[16px]">No products found</p>
            </div>
        );
    }

    return (
        <div>
            {title && (
                <h2 className="text-[22px] md:text-3xl font-serif font-bold text-[#2A2626] mb-6 md:mb-8">
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
