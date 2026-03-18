'use client';

import { useState, useEffect } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import BestSellers from '@/components/home/BestSellers';
import OfferBanner from '@/components/home/OfferBanner';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import { Category, Product } from '@/types';
import api from '@/lib/api';
import { Home, Shield, Truck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [featured, setFeatured] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, featRes] = await Promise.all([
                    api.get('/categories').catch(() => ({ data: { data: { categories: [] } } })),
                    api.get('/products/featured').catch(() => ({ data: { data: { products: [] } } })),
                ]);
                setCategories(catRes.data?.data?.categories || []);
                setFeatured(featRes.data?.data?.products || []);
            } catch {
                // Use empty arrays — will show design without data
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const badges = [
        { icon: Home, title: t('homemade'), desc: t('homemadeDesc') },
        { icon: Sparkles, title: t('noPreservatives'), desc: t('noPreservativesDesc') },
        { icon: Truck, title: t('freeDelivery'), desc: t('freeDeliveryDesc') },
        { icon: Shield, title: t('securePay'), desc: t('securePayDesc') },
    ];

    return (
        <main className="bg-[#FAF8F5]">
            <HeroBanner />

            {/* Trust Badges - Minimal Version */}
            <section className="py-12 border-b border-[#E8E3DD] bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {badges.map((badge, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-4">
                                <div className="mb-4 text-[#8B1A1A]">
                                    <badge.icon className="w-6 h-6 stroke-[1.5]" />
                                </div>
                                <h3 className="text-sm font-semibold text-[#2A2626] mb-1 tracking-wide">{badge.title}</h3>
                                <p className="text-[12px] text-[#6B6363] leading-relaxed max-w-[200px]">{badge.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="py-32 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <CategoryGrid categories={categories} />
                    {featured.length > 0 && <BestSellers products={featured} />}
                    <OfferBanner />
                    <WhyChooseUs />
                </>
            )}
        </main>
    );
}
