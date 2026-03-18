'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Leaf, Award, Heart, ShieldCheck } from 'lucide-react';

export default function WhyChooseUs() {
    const { t } = useLanguage();

    const features = [
        {
            icon: Heart,
            key: 'traditional',
            descKey: 'traditionalDesc'
        },
        {
            icon: Leaf,
            key: 'freshIngredients',
            descKey: 'freshIngredientsDesc'
        },
        {
            icon: Award,
            key: 'handcrafted',
            descKey: 'handcraftedDesc'
        },
        {
            icon: ShieldCheck,
            key: 'fastDelivery',
            descKey: 'fastDeliveryDesc'
        }
    ];

    return (
        <section className="py-24 md:py-32 bg-[#FAF8F5] border-t border-[#E8E3DD]" id="why-choose-us">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 md:mb-24">
                    <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#C8962E] mb-4 block">
                        Our Philosophy
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#2A2626]">
                        {t('whyChooseUs')}
                    </h2>
                </div>

                {/* Minimalist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                    {features.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div key={i} className="flex flex-col text-center sm:text-left group">
                                <div className="mb-6 mx-auto sm:mx-0 inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#E8E3DD] bg-white group-hover:border-[#C8962E] transition-colors duration-500">
                                    <Icon className="w-5 h-5 text-[#8B1A1A]" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[18px] font-serif font-medium text-[#2A2626] mb-3">
                                    {t(feat.key as any)}
                                </h3>
                                <p className="text-[14px] leading-relaxed text-[#6B6363]">
                                    {t(feat.descKey as any)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
