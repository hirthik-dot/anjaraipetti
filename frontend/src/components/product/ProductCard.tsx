'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
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
        <div
            className="group/card relative rounded overflow-hidden transition-all duration-300 md:hover:translate-y-[-4px] md:hover:shadow-lg border border-[#E8E3DD] tap-feedback bg-white"
            id={`product-${product.id}`}
        >
            {/* Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#2A2626] text-[#FFFFFF] text-[10px] font-bold tracking-widest uppercase rounded-sm">
                    {discount}% {t('off')}
                </div>
            )}

            {/* Image Area — Amber Square Background */}
            <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden" style={{ backgroundColor: '#F5A623', padding: '16px' }}>
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src={product.images[0] || '/placeholder.jpg'}
                        alt={isEnglish ? product.name : product.nameTa}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        loading="lazy"
                        style={{ maxWidth: '80%', padding: '4px', margin: 'auto' }}
                    />
                </div>

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="text-white text-[11px] font-semibold tracking-widest uppercase border border-white px-4 py-2 bg-black/30">
                            {t('outOfStock')}
                        </span>
                    </div>
                )}
            </Link>

            {/* Slide-in action menu (Moved outside of Link) */}
            {!isOutOfStock && (
                <div className="absolute top-4 right-3 translate-x-[200%] opacity-0 flex flex-col gap-2 transition-all duration-300 ease-out md:group-hover/card:translate-x-0 md:group-hover/card:opacity-100 z-[50]">
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast.success('Added to wishlist'); }}
                        className="w-[42px] h-[42px] bg-white shadow-md flex items-center justify-center text-[#2A2626] hover:bg-[#8B1A1A] hover:text-white transition-colors rounded-full"
                        aria-label="Add to wishlist"
                    >
                        <Heart className="w-5 h-5 stroke-[1.2]" />
                    </button>
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e); }} 
                        className="w-[42px] h-[42px] bg-white shadow-md flex items-center justify-center text-[#2A2626] hover:bg-[#8B1A1A] hover:text-white transition-colors rounded-full"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart className="w-5 h-5 stroke-[1.2]" />
                    </button>
                    <Link href={`/products/${product.id}`} className="w-[42px] h-[42px] bg-white shadow-md flex items-center justify-center text-[#2A2626] hover:bg-[#8B1A1A] hover:text-white transition-colors rounded-full" aria-label="View details">
                        <ArrowRight className="w-5 h-5 stroke-[1.2]" />
                    </Link>
                </div>
            )}

            {/* Text Area */}
            <div className="p-3 md:p-4 bg-white">
                {product.category && (
                    <span className="text-[10px] uppercase font-semibold tracking-[0.15em] text-[#C8962E] mb-1 block">
                        {isEnglish ? product.category.name : product.category.nameTa}
                    </span>
                )}

                <Link href={`/products/${product.id}`}>
                    <h3 className="text-[13px] md:text-[15px] font-bold uppercase truncate text-[#2A2626]"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        {isEnglish ? product.name : product.nameTa}
                    </h3>
                </Link>

                <p className="text-[12px] text-[#6B6363] mt-0.5">{product.weight}</p>

                <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[13px] font-medium text-[#555]">₹{product.price}</span>
                    {product.mrp > product.price && (
                        <span className="text-[12px] text-[#999] line-through">₹{product.mrp}</span>
                    )}
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-[14px]" style={{ color: '#FFD700' }}>★</span>
                    ))}
                </div>

                <div className="w-full h-[1px] bg-[#E8E3DD] my-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" />

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex items-center justify-center w-full gap-2 py-2 text-[12px] font-medium uppercase tracking-wider transition-all duration-300 min-h-[44px] ${
                        isOutOfStock
                            ? 'text-[#AFA8A3] cursor-not-allowed'
                            : 'text-[#8B1A1A] hover:text-[#C8962E] opacity-100 lg:opacity-0 lg:group-hover:opacity-100'
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
