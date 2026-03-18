'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';

const fallbackCategories = [
    { name: 'Masala', nameTa: 'மசாலா', slug: 'masala', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop', desc: 'Authentic stone-ground spice blends roasted to perfection.' },
    { name: 'Sweets', nameTa: 'இனிப்புகள்', slug: 'sweets', image: 'https://images.unsplash.com/photo-1610486259061-0ae75e381023?q=80&w=800&auto=format&fit=crop', desc: 'Traditional sweets made with pure ghee and raw sugar.' },
    { name: 'Snacks', nameTa: 'தின்பண்டங்கள்', slug: 'snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568a70d50?q=80&w=800&auto=format&fit=crop', desc: 'Crispy, savory evening snacks fried in fresh groundnut oil.' },
];

interface CategoryGridProps {
    categories?: Category[];
}

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
    const { t, isEnglish } = useLanguage();

    const displayCategories = categories.length > 0 ? categories : null;

    return (
        <section className="section-padding bg-[#FAF8F5]" id="categories">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C8962E] mb-3 block">
                        Our Collections
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#2A2626] mb-4">
                        {t('exploreCategories')}
                    </h2>
                    <p className="text-[#6B6363] text-[15px] leading-relaxed">
                        Discover the true taste of tradition. Every category features authentic recipes passed down through generations.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {fallbackCategories.map((cat, i) => {
                        const apiCat = displayCategories?.find(c => c.slug === cat.slug);

                        return (
                            <Link
                                key={cat.slug}
                                href={`/category/${cat.slug}`}
                                className="group block fade-in-up"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] mb-6 border border-[#E8E3DD]">
                                    <Image
                                        src={apiCat?.image || cat.image}
                                        alt={isEnglish ? (apiCat?.name || cat.name) : (apiCat?.nameTa || cat.nameTa)}
                                        fill
                                        className="object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />
                                </div>

                                <div className="text-center px-4">
                                    <h3 className="text-2xl font-serif text-[#2A2626] mb-2 group-hover:text-[#8B1A1A] transition-colors">
                                        {isEnglish ? (apiCat?.name || cat.name) : (apiCat?.nameTa || cat.nameTa)}
                                    </h3>
                                    <p className="text-[14px] text-[#6B6363] leading-relaxed mb-4">
                                        {cat.desc}
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-[12px] font-medium tracking-wide uppercase text-[#8B1A1A] group-hover:text-[#C8962E] transition-colors">
                                        Discover <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
