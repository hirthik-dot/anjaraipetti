'use client';

import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';
import CartItem from './CartItem';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { t } = useLanguage();
    const items = useCartStore((s) => s.items);
    const getSubtotal = useCartStore((s) => s.getSubtotal);
    const getDeliveryCharge = useCartStore((s) => s.getDeliveryCharge);
    const getTotal = useCartStore((s) => s.getTotal);

    const subtotal = getSubtotal();
    const deliveryCharge = getDeliveryCharge();
    const total = getTotal();
    const freeDeliveryThreshold = 499;
    const remaining = Math.max(0, freeDeliveryThreshold - subtotal);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 animate-slide-in-right flex flex-col" id="cart-drawer">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[--color-cream]">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-[--color-primary]" />
                        <h2 className="text-xl font-heading font-bold text-[--color-brown]">{t('yourCart')}</h2>
                        <span className="px-2 py-0.5 bg-[--color-primary] text-white text-xs font-bold rounded-full">
                            {items.length}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-[--color-cream] flex items-center justify-center hover:bg-[--color-primary] hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="w-16 h-16 text-[--color-brown]/20 mb-4" />
                            <p className="text-[--color-brown]/50 mb-4">{t('cartEmpty')}</p>
                            <Link
                                href="/"
                                onClick={onClose}
                                className="px-6 py-3 bg-[--color-primary] text-white rounded-xl font-semibold hover:bg-[--color-primary-light] transition-colors"
                            >
                                {t('startShopping')}
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <CartItem key={item.product.id} item={item} />
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[--color-cream] p-6 space-y-4 bg-[--color-light]">
                        {/* Free delivery progress */}
                        {remaining > 0 ? (
                            <div className="space-y-2">
                                <p className="text-sm text-[--color-brown]/60">
                                    {t('freeDeliveryProgress').replace('{amount}', remaining.toString())}
                                </p>
                                <div className="w-full h-2 bg-[--color-cream] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[--color-primary] to-[--color-secondary] rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-[--color-success] font-semibold">{t('freeDeliveryUnlocked')}</p>
                        )}

                        {/* Totals */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[--color-brown]/60">{t('subtotal')}</span>
                                <span className="font-semibold">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[--color-brown]/60">{t('deliveryCharge')}</span>
                                <span className={`font-semibold ${deliveryCharge === 0 ? 'text-[--color-success]' : ''}`}>
                                    {deliveryCharge === 0 ? t('free') : `₹${deliveryCharge}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-[--color-cream]">
                                <span>{t('total')}</span>
                                <span className="text-[--color-primary]">₹{total}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[--color-primary] to-[--color-primary-light] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            id="checkout-btn"
                        >
                            {t('proceedToCheckout')}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
