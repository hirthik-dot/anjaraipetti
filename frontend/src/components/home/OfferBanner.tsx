'use client';

import { useLanguage } from '@/hooks/useLanguage';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function OfferBanner() {
    const { t } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-[#8B1A1A] py-24 md:py-32" id="offer-banner">
            {/* Elegant Background Patterns */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #E8E3DD 1px, transparent 0)',
                backgroundSize: '32px 32px'
            }} />
            
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 bg-gradient-to-l from-white to-transparent" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#FFFFFF]">
                <span className="text-[12px] font-medium tracking-[0.25em] uppercase text-[#C8962E] mb-6 block">
                    Special Offer
                </span>
                
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-medium mb-8 leading-[1.1] tracking-tight text-white" style={{ color: '#FFFFFF' }}>
                    {t('offerTitle')}
                </h2>

                <p className="text-[18px] text-white/80 font-serif italic mb-12 max-w-2xl mx-auto">
                    {t('offerDesc')} Use code <span className="font-sans font-bold text-[#C8962E] tracking-wider ml-1 px-2 py-0.5 border border-[#C8962E]/30 rounded-[2px]">{t('offerCode')}</span> at checkout.
                </p>

                <Link
                    href="/category/masala"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#2A2626] font-medium text-[14px] uppercase tracking-wider hover:bg-[#C8962E] hover:text-white transition-all duration-300 rounded-[2px]"
                >
                    Shop the Collection
                    <ArrowRight className="w-4 h-4 ml-3" />
                </Link>
            </div>
        </section>
    );
}
