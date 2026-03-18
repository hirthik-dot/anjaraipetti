'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Eye } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { t, isEnglish } = useLanguage();
    const addItem = useCartStore((s) => s.addItem);

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    const isOutOfStock = product.stock <= 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOutOfStock) {
            addItem(product);
            toast.success(`${isEnglish ? product.name : product.nameTa} added to cart!`);
        }
    };

    return (
        <div className="group relative bg-[#FFFFFF] rounded-[8px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#2A2626]/5 border border-[#E8E3DD]"
            id={`product-${product.id}`}>

            {/* Subtle Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-[#2A2626] text-[#FFFFFF] text-[10px] font-medium tracking-widest uppercase rounded-[2px]">
                    {discount}% {t('off')}
                </div>
            )}

            {/* Image Area */}
            <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#FAF8F5]">
                <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={isEnglish ? product.name : product.nameTa}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FAF8F5]/80 backdrop-blur-[2px]">
                        <span className="text-[#2A2626] text-[11px] font-semibold tracking-widest uppercase border border-[#2A2626] px-4 py-2 bg-white">
                            {t('outOfStock')}
                        </span>
                    </div>
                )}

                {/* Elegant Quick View - Only visible on hover for desktop, persistent small icon for mobile maybe? Actually, just let mobile users tap the image directly to view product. */}
                {!isOutOfStock && (
                    <div className="absolute inset-0 bg-transparent flex items-end justify-center pb-6 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex">
                        <span
                            className="bg-white/90 backdrop-blur-md border border-[#E8E3DD] text-[#2A2626] text-[12px] font-medium tracking-wider uppercase px-6 py-2.5 rounded-[40px] shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#8B1A1A] hover:text-white hover:border-[#8B1A1A]"
                        >
                            Quick View
                        </span>
                    </div>
                )}
            </Link>

            {/* Product Info */}
            <div className="p-5 flex flex-col items-center text-center">
                {product.category && (
                    <span className="text-[10px] uppercase font-semibold tracking-[0.15em] text-[#C8962E] mb-2">
                        {isEnglish ? product.category.name : product.category.nameTa}
                    </span>
                )}

                <Link href={`/products/${product.id}`} className="group-hover:text-[#8B1A1A] transition-colors line-clamp-1 w-full">
                    <h3 className="text-[16px] font-serif font-medium text-[#2A2626]">
                        {isEnglish ? product.name : product.nameTa}
                    </h3>
                </Link>

                <p className="text-[12px] text-[#6B6363] mt-1 mb-3">{product.weight}</p>

                <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-[15px] font-medium text-[#2A2626]">₹{product.price}</span>
                    {product.mrp > product.price && (
                        <span className="text-[13px] text-[#6B6363] line-through">₹{product.mrp}</span>
                    )}
                </div>

                <div className="w-full h-[1px] bg-[#E8E3DD] my-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" />

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex items-center justify-center w-full gap-2 py-2 lg:py-0 text-[12px] font-medium uppercase tracking-wider transition-all duration-300 ${
                        isOutOfStock
                            ? 'text-[#AFA8A3] cursor-not-allowed'
                            : 'text-[#8B1A1A] hover:text-[#C8962E] opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transform translate-y-0 lg:translate-y-2 lg:group-hover:translate-y-0'
                    }`}
                    id={`add-to-cart-${product.id}`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('addToCart')}</span>
                </button>
            </div>
        </div>
    );
}
