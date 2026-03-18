'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Minus, Plus, Package } from 'lucide-react';
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
            <div className="pt-24 pb-16 flex justify-center items-center min-h-screen">
                <div className="w-12 h-12 border-4 border-[--color-cream] border-t-[--color-primary] rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-24 pb-16 text-center min-h-screen flex flex-col items-center justify-center">
                <Package className="w-16 h-16 text-[--color-brown]/20 mb-4" />
                <h2 className="text-2xl font-heading font-bold text-[--color-brown] mb-2">Product not found</h2>
                <Link href="/" className="text-[--color-primary] hover:underline">{t('continueShopping')}</Link>
            </div>
        );
    }

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    const isOutOfStock = product.stock <= 0;

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[--color-brown]/50 hover:text-[--color-primary] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {t('continueShopping')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <ProductImageGallery images={product.images} name={isEnglish ? product.name : product.nameTa} />

                    {/* Details */}
                    <div className="space-y-6">
                        {product.category && (
                            <Link
                                href={`/category/${product.category.slug}`}
                                className="text-sm text-[--color-secondary] font-semibold uppercase tracking-wider hover:text-[--color-secondary-dark]"
                            >
                                {isEnglish ? product.category.name : product.category.nameTa}
                            </Link>
                        )}

                        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[--color-brown]">
                            {isEnglish ? product.name : product.nameTa}
                        </h1>

                        {/* Price */}
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold text-[--color-primary]">₹{product.price}</span>
                            {product.mrp > product.price && (
                                <>
                                    <span className="text-xl text-[--color-brown]/40 line-through">₹{product.mrp}</span>
                                    <span className="px-3 py-1 bg-[--color-primary]/10 text-[--color-primary] text-sm font-bold rounded-lg">
                                        {discount}% {t('off')}
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="text-sm text-[--color-brown]/50">Weight: {product.weight}</p>

                        <p className="text-[--color-brown]/70 leading-relaxed">
                            {isEnglish ? product.description : product.descTa}
                        </p>

                        {/* Stock status */}
                        <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
                            <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                {isOutOfStock ? t('outOfStock') : `In Stock (${product.stock})`}
                            </span>
                        </div>

                        {/* Quantity & Add to Cart */}
                        {!isOutOfStock && (
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex items-center border border-[--color-brown]/10 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-[--color-cream] transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 h-12 flex items-center justify-center font-bold text-lg border-x border-[--color-brown]/10">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-[--color-cream] transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[--color-primary] to-[--color-primary-light] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                                    id="product-add-to-cart"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {t('addToCart')} — ₹{product.price * quantity}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
