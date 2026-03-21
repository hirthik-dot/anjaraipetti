'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Minus, Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { t, isEnglish } = useLanguage();
    const addItem = useCartStore((s) => s.addItem);
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data?.data?.product || null);
            } catch {
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product && product.stock > 0) {
            addItem(product, quantity);
            toast.success(`${isEnglish ? product.name : product.nameTa} added to cart!`);
        }
    };

    if (loading) {
        return (
            <div className="pt-12 pb-24 flex justify-center items-center min-h-[70vh]">
                <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-12 pb-24 text-center min-h-[70vh] flex flex-col items-center justify-center fade-in-up">
                <Package className="w-12 h-12 text-[#6B6363]/40 mb-6" strokeWidth={1} />
                <h2 className="text-2xl font-serif text-[#2A2626] mb-3">Product not found</h2>
                <Link href="/" className="text-[#8B1A1A] text-[13px] font-medium tracking-wide hover:underline decoration-[#8B1A1A]/30 underline-offset-4">
                    {t('continueShopping')}
                </Link>
            </div>
        );
    }

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    const isOutOfStock = product.stock <= 0;

    return (
        <div className="pt-8 md:pt-12 bg-[#FAF8F5] min-h-screen" style={{ paddingBottom: isOutOfStock ? '24px' : '88px' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-[#6B6363] hover:text-[#8B1A1A] mb-6 md:mb-12 transition-colors min-h-[44px]">
                    <ArrowLeft className="w-4 h-4" />
                    {t('continueShopping')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 lg:gap-20">
                    {/* Images */}
                    <div className="lg:col-span-6 xl:col-span-5">
                        <ProductImageGallery images={product.images} name={isEnglish ? product.name : product.nameTa} />
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
                        <div>
                            {product.category && (
                                <Link
                                    href={`/category/${product.category.slug}`}
                                    className="text-[11px] font-semibold text-[#C8962E] uppercase tracking-[0.2em] mb-3 md:mb-4 block hover:text-[#2A2626] transition-colors"
                                >
                                    {isEnglish ? product.category.name : product.category.nameTa}
                                </Link>
                            )}

                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif text-[#2A2626] leading-tight mb-4 md:mb-6">
                                {isEnglish ? product.name : product.nameTa}
                            </h1>

                            {/* Price */}
                            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                <span className="text-[24px] font-bold text-[#2A2626]">₹{product.price}</span>
                                {product.mrp > product.price && (
                                    <>
                                        <span className="text-[18px] md:text-xl text-[#6B6363] line-through font-light">₹{product.mrp}</span>
                                        <span className="px-2.5 py-1 bg-[#8B1A1A] text-white text-[11px] font-semibold tracking-widest uppercase rounded-sm ml-1">
                                            {discount}% {t('off')}
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-[13px] text-[#6B6363] font-medium tracking-wide uppercase">Weight: {product.weight}</p>
                        </div>

                        <div className="w-16 h-[1px] bg-[#C8962E] opacity-50"></div>

                        <p className="text-[15px] text-[#6B6363] font-light leading-relaxed">
                            {isEnglish ? product.description : product.descTa}
                        </p>

                        {/* Making Video */}
                        {product.makingVideoUrl && (
                            <div className="pt-4">
                                <h3 className="text-[16px] font-bold text-[#2A2626] mb-3"
                                    style={{ fontFamily: "'Inter', sans-serif" }}>
                                    How It&apos;s Made
                                </h3>
                                <div className="relative w-full rounded-lg overflow-hidden border border-[#E8E3DD]"
                                    style={{ aspectRatio: '16/9' }}>
                                    <video
                                        src={product.makingVideoUrl}
                                        controls
                                        preload="metadata"
                                        playsInline
                                        className="w-full h-full object-cover"
                                        style={{ borderRadius: '8px' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Desktop Add to Cart */}
                        <div className="hidden md:block pt-4">
                            {/* Stock status */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-[#8B1A1A]' : 'bg-[#218F5B]'}`} />
                                <span className={`text-[12px] uppercase tracking-wider font-semibold ${isOutOfStock ? 'text-[#8B1A1A]' : 'text-[#218F5B]'}`}>
                                    {isOutOfStock ? t('outOfStock') : `In Stock (${product.stock})`}
                                </span>
                            </div>

                            {/* Quantity & Add to Cart */}
                            {!isOutOfStock && (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-[#E8E3DD] rounded bg-white h-14">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-14 h-full flex items-center justify-center text-[#6B6363] hover:text-[#8B1A1A] hover:bg-[#FAF8F5] transition-colors"
                                        >
                                            <Minus className="w-4 h-4" strokeWidth={1.5} />
                                        </button>
                                        <span className="w-14 h-full flex items-center justify-center font-medium text-[15px] text-[#2A2626] border-x border-[#E8E3DD]">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-14 h-full flex items-center justify-center text-[#6B6363] hover:text-[#8B1A1A] hover:bg-[#FAF8F5] transition-colors"
                                        >
                                            <Plus className="w-4 h-4" strokeWidth={1.5} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 flex items-center justify-center gap-3 h-14 bg-[#8B1A1A] text-white text-[13px] font-medium tracking-widest uppercase rounded hover:bg-[#661010] active:scale-[0.98] transition-all"
                                        id="product-add-to-cart"
                                    >
                                        <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                                        <span>{t('addToCart')} — ₹{product.price * quantity}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar - Mobile Only */}
            {!isOutOfStock && (
                <div
                    className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-[#E8E3DD] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
                    style={{ padding: '8px 16px' }}
                >
                    <div className="flex items-center gap-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-[#E8E3DD] rounded bg-[#FAF8F5]" style={{ height: '44px' }}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="flex items-center justify-center text-[#6B6363]"
                                style={{ width: '44px', height: '44px' }}
                            >
                                <Minus className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                            <span className="w-10 text-center font-medium text-[15px] text-[#2A2626]">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="flex items-center justify-center text-[#6B6363]"
                                style={{ width: '44px', height: '44px' }}
                            >
                                <Plus className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#8B1A1A] text-white text-[14px] font-semibold uppercase tracking-wider rounded active:scale-[0.98] transition-all"
                            style={{ height: '56px' }}
                            id="mobile-add-to-cart"
                        >
                            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                            Add — ₹{product.price * quantity}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
