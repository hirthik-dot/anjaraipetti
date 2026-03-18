'use client';

import { CreditCard, Banknote } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface PaymentOptionsProps {
    selected: 'RAZORPAY' | 'COD';
    onChange: (mode: 'RAZORPAY' | 'COD') => void;
}

export default function PaymentOptions({ selected, onChange }: PaymentOptionsProps) {
    const { t } = useLanguage();

    const options = [
        {
            id: 'RAZORPAY' as const,
            icon: CreditCard,
            label: t('payOnline'),
            desc: 'UPI, Cards, Net Banking',
        },
        {
            id: 'COD' as const,
            icon: Banknote,
            label: t('cashOnDelivery'),
            desc: 'Pay when delivered',
        },
    ];

    return (
        <div className="space-y-4" id="payment-options">
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onChange(option.id)}
                    className={`w-full flex items-center gap-6 p-6 rounded-[8px] border transition-all duration-300 group ${
                        selected === option.id
                            ? 'border-[#C8962E] bg-[#FAF8F5]'
                            : 'border-[#E8E3DD] bg-white hover:border-[#6B6363]/50'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                        selected === option.id
                            ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white'
                            : 'bg-[#FAF8F5] border-[#E8E3DD] text-[#6B6363] group-hover:border-[#6B6363]/30 group-hover:bg-white'
                    }`}>
                        <option.icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="text-left flex-1">
                        <p className={`font-serif text-[18px] transition-colors ${selected === option.id ? 'text-[#8B1A1A]' : 'text-[#2A2626]'}`}>
                            {option.label}
                        </p>
                        <p className="text-[12px] text-[#6B6363] tracking-wide mt-0.5">{option.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected === option.id
                            ? 'border-[#8B1A1A] bg-white'
                            : 'border-[#E8E3DD]'
                    }`}>
                        {selected === option.id && (
                            <div className="w-3 h-3 bg-[#8B1A1A] rounded-full" />
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
