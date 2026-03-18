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
                <p className="text-[--color-brown]/50 text-lg">No products found</p>
            </div>
        );
    }

    return (
        <div>
            {title && (
                <h2 className="text-3xl font-heading font-bold text-[--color-brown] mb-8">
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
