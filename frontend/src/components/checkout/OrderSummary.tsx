'use client';

import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';

export default function OrderSummary() {
    const { t, isEnglish } = useLanguage();
    const items = useCartStore((s) => s.items);
    const getSubtotal = useCartStore((s) => s.getSubtotal);
    const getDeliveryCharge = useCartStore((s) => s.getDeliveryCharge);
    const getTotal = useCartStore((s) => s.getTotal);

    const subtotal = getSubtotal();
    const deliveryCharge = getDeliveryCharge();
    const total = getTotal();

    return (
        <div className="bg-white rounded-[8px] p-8 border border-[#E8E3DD] shadow-sm shadow-[#2A2626]/5" id="order-summary">
            <h3 className="text-[16px] font-serif text-[#2A2626] mb-6 pb-4 border-b border-[#E8E3DD]">
                {t('yourCart')} <span className="text-[#6B6363] text-[13px] ml-1">({items.length} items)</span>
            </h3>

            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 group">
                        <div className="relative w-16 h-16 rounded-[4px] border border-[#E8E3DD] overflow-hidden shrink-0 bg-[#FAF8F5]">
                            <Image
                                src={item.product.images[0] || '/placeholder.jpg'}
                                alt={isEnglish ? item.product.name : item.product.nameTa}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="64px"
                            />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-[13px] font-medium text-[#2A2626] truncate">
                                {isEnglish ? item.product.name : item.product.nameTa}
                            </p>
                            <p className="text-[11px] text-[#6B6363] uppercase tracking-wider mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-[14px] font-medium text-[#2A2626] flex items-center">
                            ₹{item.product.price * item.quantity}
                        </p>
                    </div>
                ))}
            </div>

            <div className="space-y-3 text-[13px] pt-6 border-t border-[#E8E3DD] text-[#6B6363]">
                <div className="flex justify-between items-center">
                    <span>{t('subtotal')}</span>
                    <span className="font-medium text-[#2A2626]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>{t('deliveryCharge')}</span>
                    <span className={`font-medium ${deliveryCharge === 0 ? 'text-[#C8962E]' : 'text-[#2A2626]'}`}>
                        {deliveryCharge === 0 ? t('free') : `₹${deliveryCharge}`}
                    </span>
                </div>
                <div className="flex justify-between items-center text-[18px] text-[#2A2626] pt-4 mt-2 border-t border-[#E8E3DD]/50">
                    <span className="font-serif">{t('total')}</span>
                    <span className="font-medium">₹{total}</span>
                </div>
            </div>
        </div>
    );
}
