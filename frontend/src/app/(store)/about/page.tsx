'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { ChefHat, Heart, Award, Users } from 'lucide-react';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[--color-primary] to-[--color-secondary] flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <ChefHat className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[--color-brown] mb-4">{t('aboutTitle')}</h1>
                    <p className="text-lg text-[--color-brown]/60 max-w-2xl mx-auto leading-relaxed">{t('aboutDesc')}</p>
                </div>

                {/* Story */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="bg-gradient-to-br from-[--color-primary] to-[--color-brown] rounded-3xl p-10 text-white">
                        <h2 className="text-3xl font-heading font-bold mb-4">Our Story</h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            Born from a passion for authentic Tamil Nadu cuisine, Anjaraipetti brings the cherished flavors of home-cooked food to families across India.
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            Every product we offer is crafted using recipes passed down through generations, with the same love and care that goes into cooking for family.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {[
                            { icon: Heart, title: 'Made with Love', desc: 'Every product is prepared with genuine care and the finest ingredients sourced from local farms.' },
                            { icon: Award, title: 'Quality First', desc: 'We maintain the highest standards of quality with zero preservatives and 100% natural ingredients.' },
                            { icon: Users, title: 'Community', desc: 'We employ local artisans and support traditional food preparation methods that preserve our culinary heritage.' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-[--color-primary]/10 flex items-center justify-center shrink-0">
                                    <item.icon className="w-6 h-6 text-[--color-primary]" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-[--color-brown]">{item.title}</h3>
                                    <p className="text-sm text-[--color-brown]/60">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
