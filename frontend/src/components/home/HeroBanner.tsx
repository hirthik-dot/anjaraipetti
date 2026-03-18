'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function HeroBanner() {
    const { t } = useLanguage();

    return (
        <section className="relative min-h-[90vh] flex items-center bg-[#FAF8F5] overflow-hidden pt-20">
            {/* Minimal Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-[#F3EEEA] rounded-bl-[120px] transform translate-x-10 -translate-y-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    
                    {/* Text Column */}
                    <div className="flex-1 max-w-2xl fade-in-up delay-1">
                        <div className="inline-block px-3 py-1 mb-6 text-[11px] font-semibold tracking-[0.2em] uppercase border border-[#E8E3DD] rounded-full text-[#6B6363]">
                            {t('homemade')} — {t('noPreservatives')}
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-serif font-medium leading-[1.05] text-[#2A2626] mb-6 tracking-tight">
                            {t('heroTitle')}
                        </h1>

                        <p className="text-xl sm:text-2xl font-serif italic text-[#8B1A1A] mb-8">
                            {t('heroSubtitle')}
                        </p>

                        <p className="text-[17px] text-[#6B6363] leading-relaxed max-w-lg mb-12">
                            {t('heroDesc')}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                            <Link href="/category/masala" className="btn-primary">
                                {t('shopNow')}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            <Link href="#categories" className="text-[15px] font-medium text-[#2A2626] hover:text-[#C8962E] transition-colors pb-1 border-b border-[#E8E3DD] hover:border-[#C8962E]">
                                {t('exploreCategories')}
                            </Link>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none relative fade-in-up delay-2">
                        <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-[#2A2626]/5">
                            <Image
                                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2670&auto=format&fit=crop"
                                alt="Authentic Indian Spices"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {/* Overlay gradient to soften image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#2A2626]/20 to-transparent" />
                        </div>

                        {/* Floating elegant badge */}
                        <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl shadow-[#2A2626]/5 max-w-[200px] hidden md:block border border-[#E8E3DD]">
                            <div className="text-3xl font-serif text-[#C8962E] mb-1">Authentic</div>
                            <div className="text-[11px] uppercase tracking-widest text-[#6B6363]">Tamil Nadu Recipes</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
