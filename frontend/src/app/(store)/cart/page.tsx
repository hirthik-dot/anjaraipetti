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
            <div className="pt-32 pb-24 min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center animate-fade-in-up">
                <ShoppingBag className="w-16 h-16 text-[#6B6363]/30 mb-8" strokeWidth={1} />
                <h1 className="text-3xl font-serif text-[#2A2626] mb-4">{t('cartEmpty')}</h1>
                <p className="text-[#6B6363] text-[15px] font-light mb-10 tracking-wide">Add some delicious items to your cart!</p>
                <Link href="/" className="px-10 py-4 bg-[#8B1A1A] text-white text-[12px] font-medium tracking-widest uppercase rounded-[4px] hover:bg-[#661010] active:scale-[0.98] transition-all shadow-sm">
                    {t('startShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 bg-[#FAF8F5] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-[#6B6363] hover:text-[#8B1A1A] mb-12 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {t('continueShopping')}
                </Link>

                <h1 className="text-4xl lg:text-5xl font-serif text-[#2A2626] mb-12">{t('yourCart')}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Items */}
                    <div className="lg:col-span-8 flex flex-col gap-6 animate-fade-in-up">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex gap-6 p-6 bg-white border border-[#E8E3DD] rounded-[8px] hover:border-[#6B6363]/30 transition-all">
                                <Link href={`/products/${item.product.id}`} className="relative w-28 h-28 rounded-[4px] overflow-hidden shrink-0 border border-[#E8E3DD]">
                                    <Image src={item.product.images[0] || '/placeholder.jpg'} alt={isEnglish ? item.product.name : item.product.nameTa} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="112px" />
                                </Link>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link href={`/products/${item.product.id}`} className="text-[18px] font-serif text-[#2A2626] hover:text-[#8B1A1A] transition-colors leading-snug">
                                                {isEnglish ? item.product.name : item.product.nameTa}
                                            </Link>
                                            <p className="text-[12px] uppercase tracking-wider text-[#6B6363] mt-1">{item.product.weight}</p>
                                        </div>
                                        <button onClick={() => removeItem(item.product.id)} className="text-[#6B6363] hover:text-[#8B1A1A] p-2 -mr-2 transition-colors" title="Remove item">
                                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center border border-[#E8E3DD] rounded-[4px] h-10">
                                            <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-10 h-full flex items-center justify-center text-[#6B6363] hover:text-[#8B1A1A] hover:bg-[#FAF8F5] transition-colors">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-10 h-full flex items-center justify-center text-[13px] font-medium text-[#2A2626] border-x border-[#E8E3DD]">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))} className="w-10 h-full flex items-center justify-center text-[#6B6363] hover:text-[#8B1A1A] hover:bg-[#FAF8F5] transition-colors">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-[16px] font-medium text-[#2A2626]">₹{item.product.price * item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white border border-[#E8E3DD] rounded-[8px] p-8 sticky top-32 shadow-sm shadow-[#2A2626]/5 animate-fade-in-up delay-1">
                            {remaining > 0 ? (
                                <div className="mb-8 space-y-3 pb-6 border-b border-[#E8E3DD]">
                                    <p className="text-[13px] font-medium text-[#2A2626]">{t('freeDeliveryProgress').replace('{amount}', remaining.toString())}</p>
                                    <div className="w-full h-1.5 bg-[#FAF8F5] border border-[#E8E3DD] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#8B1A1A] rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }} />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[12px] uppercase tracking-wider text-[#218F5B] font-semibold mb-8 pb-6 border-b border-[#E8E3DD]">{t('freeDeliveryUnlocked')}</p>
                            )}

                            <div className="space-y-4 text-[14px]">
                                <div className="flex justify-between items-center text-[#6B6363]">
                                    <span>{t('subtotal')}</span>
                                    <span className="font-medium text-[#2A2626]">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#6B6363]">
                                    <span>{t('deliveryCharge')}</span>
                                    <span className={`font-medium ${deliveryCharge === 0 ? 'text-[#C8962E]' : 'text-[#2A2626]'}`}>{deliveryCharge === 0 ? t('free') : `₹${deliveryCharge}`}</span>
                                </div>
                                <div className="flex justify-between items-end text-[20px] pt-6 mt-4 border-t border-[#E8E3DD]">
                                    <span className="font-serif text-[#2A2626] font-medium">{t('total')}</span>
                                    <span className="font-medium text-[#2A2626]">₹{total}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="flex items-center justify-center gap-3 w-full py-4 mt-8 bg-[#8B1A1A] text-white text-[13px] font-medium tracking-widest uppercase rounded-[4px] hover:bg-[#661010] active:scale-[0.98] transition-all">
                                {t('proceedToCheckout')}
                                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
