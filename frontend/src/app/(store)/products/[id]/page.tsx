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
            <div className="pt-32 pb-24 flex justify-center items-center min-h-[70vh]">
                <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-32 pb-24 text-center min-h-[70vh] flex flex-col items-center justify-center fade-in-up">
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
        <div className="pt-32 pb-24 bg-[#FAF8F5] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-[#6B6363] hover:text-[#8B1A1A] mb-12 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {t('continueShopping')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Images */}
                    <div className="lg:col-span-6 xl:col-span-5">
                        <ProductImageGallery images={product.images} name={isEnglish ? product.name : product.nameTa} />
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center space-y-8 animate-fade-in-up">
                        <div>
                            {product.category && (
                                <Link
                                    href={`/category/${product.category.slug}`}
                                    className="text-[11px] font-semibold text-[#C8962E] uppercase tracking-[0.2em] mb-4 block hover:text-[#2A2626] transition-colors"
                                >
                                    {isEnglish ? product.category.name : product.category.nameTa}
                                </Link>
                            )}

                            <h1 className="text-3xl sm:text-5xl font-serif text-[#2A2626] leading-tight mb-6">
                                {isEnglish ? product.name : product.nameTa}
                            </h1>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-3xl font-medium text-[#2A2626]">₹{product.price}</span>
                                {product.mrp > product.price && (
                                    <>
                                        <span className="text-xl text-[#6B6363] line-through font-light">₹{product.mrp}</span>
                                        <span className="px-2.5 py-1 bg-[#8B1A1A] text-white text-[11px] font-semibold tracking-widest uppercase rounded-[2px] ml-2">
                                            {discount}% {t('off')}
                                        </span>
                                    </>
                                )}
                            </div>
                            
                            <p className="text-[13px] text-[#6B6363] font-medium tracking-wide uppercase">Weight: {product.weight}</p>
                        </div>

                        <div className="w-16 h-[1px] bg-[#C8962E] opacity-50 my-6"></div>

                        <p className="text-[15px] text-[#6B6363] font-light leading-relaxed">
                            {isEnglish ? product.description : product.descTa}
                        </p>

                        <div className="pt-6">
                            {/* Stock status */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-[#8B1A1A]' : 'bg-[#218F5B]'}`} />
                                <span className={`text-[12px] uppercase tracking-wider font-semibold ${isOutOfStock ? 'text-[#8B1A1A]' : 'text-[#218F5B]'}`}>
                                    {isOutOfStock ? t('outOfStock') : `In Stock (${product.stock})`}
                                </span>
                            </div>

                            {/* Quantity & Add to Cart */}
                            {!isOutOfStock && (
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    <div className="flex items-center border border-[#E8E3DD] rounded-[4px] bg-white h-14">
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
                                        className="flex-1 flex items-center justify-center gap-3 h-14 bg-[#8B1A1A] text-white text-[13px] font-medium tracking-widest uppercase rounded-[4px] hover:bg-[#661010] active:scale-[0.98] transition-all"
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
        </div>
    );
}
