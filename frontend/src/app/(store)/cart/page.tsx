'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
    const { t, isEnglish } = useLanguage();
    const items = useCartStore((s) => s.items);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeItem = useCartStore((s) => s.removeItem);
    const getSubtotal = useCartStore((s) => s.getSubtotal);
    const getDeliveryCharge = useCartStore((s) => s.getDeliveryCharge);
    const getTotal = useCartStore((s) => s.getTotal);

    const subtotal = getSubtotal();
    const deliveryCharge = getDeliveryCharge();
    const total = getTotal();
    const remaining = Math.max(0, 499 - subtotal);

    if (items.length === 0) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex flex-col items-center justify-center">
                <ShoppingBag className="w-20 h-20 text-[--color-brown]/15 mb-6" />
                <h1 className="text-3xl font-heading font-bold text-[--color-brown] mb-3">{t('cartEmpty')}</h1>
                <p className="text-[--color-brown]/50 mb-8">Add some delicious items to your cart!</p>
                <Link href="/" className="px-8 py-4 bg-[--color-primary] text-white font-bold rounded-2xl hover:bg-[--color-primary-light] transition-colors">
                    {t('startShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[--color-brown]/50 hover:text-[--color-primary] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {t('continueShopping')}
                </Link>

                <h1 className="text-3xl font-heading font-bold text-[--color-brown] mb-8">{t('yourCart')}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                    <Image src={item.product.images[0] || '/placeholder.jpg'} alt={isEnglish ? item.product.name : item.product.nameTa} fill className="object-cover" sizes="96px" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/products/${item.product.id}`} className="font-heading font-bold text-[--color-brown] hover:text-[--color-primary] transition-colors">
                                        {isEnglish ? item.product.name : item.product.nameTa}
                                    </Link>
                                    <p className="text-xs text-[--color-brown]/50 mt-0.5">{item.product.weight}</p>
                                    <p className="text-lg font-bold text-[--color-primary] mt-1">₹{item.product.price}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <button onClick={() => removeItem(item.product.id)} className="text-[--color-brown]/30 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center gap-1 mt-2">
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-[--color-brown]/10 flex items-center justify-center hover:bg-[--color-cream] transition-colors">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-[--color-brown]/10 flex items-center justify-center hover:bg-[--color-cream] transition-colors">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <p className="text-sm font-bold text-[--color-brown] mt-1">₹{item.product.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
                            {remaining > 0 ? (
                                <div className="mb-6 space-y-2">
                                    <p className="text-sm text-[--color-brown]/60">{t('freeDeliveryProgress').replace('{amount}', remaining.toString())}</p>
                                    <div className="w-full h-2 bg-[--color-cream] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[--color-primary] to-[--color-secondary] rounded-full transition-all" style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }} />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-[--color-success] font-semibold mb-6">{t('freeDeliveryUnlocked')}</p>
                            )}

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-[--color-brown]/60">{t('subtotal')}</span><span className="font-semibold">₹{subtotal}</span></div>
                                <div className="flex justify-between"><span className="text-[--color-brown]/60">{t('deliveryCharge')}</span><span className={`font-semibold ${deliveryCharge === 0 ? 'text-[--color-success]' : ''}`}>{deliveryCharge === 0 ? t('free') : `₹${deliveryCharge}`}</span></div>
                                <div className="flex justify-between text-xl font-bold pt-3 border-t border-[--color-cream]"><span>{t('total')}</span><span className="text-[--color-primary]">₹{total}</span></div>
                            </div>

                            <Link href="/checkout" className="flex items-center justify-center gap-2 w-full py-4 mt-6 bg-gradient-to-r from-[--color-primary] to-[--color-primary-light] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                {t('proceedToCheckout')}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
