'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useLanguage } from '@/hooks/useLanguage';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
    item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
    const { isEnglish } = useLanguage();
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeItem = useCartStore((s) => s.removeItem);

    const { product, quantity } = item;

    return (
        <div className="flex gap-4 p-3 rounded-2xl bg-[--color-cream]/50 hover:bg-[--color-cream] transition-colors" id={`cart-item-${product.id}`}>
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={isEnglish ? product.name : product.nameTa}
                    fill
                    className="object-cover"
                    sizes="80px"
                />
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[--color-brown] truncate">
                    {isEnglish ? product.name : product.nameTa}
                </h4>
                <p className="text-xs text-[--color-brown]/50">{product.weight}</p>
                <p className="text-sm font-bold text-[--color-primary] mt-1">₹{product.price * quantity}</p>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-[--color-brown]/10 flex items-center justify-center hover:bg-[--color-primary] hover:text-white hover:border-[--color-primary] transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                        <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-[--color-brown]/10 flex items-center justify-center hover:bg-[--color-primary] hover:text-white hover:border-[--color-primary] transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                    <button
                        onClick={() => removeItem(product.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[--color-brown]/30 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
