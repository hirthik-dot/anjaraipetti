'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ComboBanner() {
    return (
        <section
            className="relative overflow-hidden w-full"
            style={{
                minHeight: '200px',
                background: 'linear-gradient(135deg, #2c1810, #8B1A1A)',
            }}
            id="combo-banner"
        >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #F5A623 1px, transparent 0)',
                backgroundSize: '28px 28px'
            }} />

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 lg:py-20">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">

                    {/* Left product images - desktop only */}
                    <div className="hidden md:flex gap-4 flex-1 justify-end">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden border-2 border-[#F5A623]/30 rotate-[-3deg] shadow-lg shadow-black/20"
                            style={{ background: '#FDF6EC' }}>
                            <div className="w-full h-full flex items-center justify-center p-2 relative">
                                <Image
                                    src="/images/1774120970047.png"
                                    alt="Dried Chilli"
                                    fill
                                    className="object-contain p-4"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden border-2 border-[#F5A623]/30 rotate-[2deg] mt-6 shadow-lg shadow-black/20"
                            style={{ background: '#FDF6EC' }}>
                            <div className="w-full h-full flex items-center justify-center p-2 relative">
                                <Image
                                    src="/images/1774120898214.png"
                                    alt="Mixed Spices"
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>

                    {/* Center Badge */}
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-[24px] md:text-[36px] font-serif font-bold text-white mb-4 leading-tight" style={{ color: '#FFFFFF' }}>
                            COMBO OFFER
                        </h2>

                        <div
                            className="px-8 py-5 md:px-12 md:py-6 rounded-xl mb-6 shadow-xl"
                            style={{
                                background: 'linear-gradient(135deg, #F5A623, #C17A00)',
                            }}
                        >
                            <div className="text-[14px] font-bold uppercase tracking-wider text-white/80 mb-1">
                                Starting From
                            </div>
                            <div className="text-[32px] md:text-[42px] font-bold text-white leading-none"
                                style={{ fontFamily: "'Inter', sans-serif" }}>
                                ₹499
                            </div>
                        </div>

                        <Link
                            href="/category/masala"
                            className="inline-flex items-center justify-center px-8 bg-white text-[#2A2626] font-semibold text-[14px] uppercase tracking-wider rounded hover:bg-[#C8962E] hover:text-white transition-all shadow-md"
                            style={{ minHeight: '44px', height: '48px' }}
                            id="combo-shop-now"
                        >
                            SHOP NOW
                        </Link>
                    </div>

                    {/* Right product images - desktop only */}
                    <div className="hidden md:flex gap-4 flex-1 justify-start">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden border-2 border-[#F5A623]/30 rotate-[3deg] mt-6 shadow-lg shadow-black/20"
                            style={{ background: '#FDF6EC' }}>
                            <div className="w-full h-full flex items-center justify-center p-2 relative">
                                <Image
                                    src="/images/1774120934893.png"
                                    alt="Masala Bowl"
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden border-2 border-[#F5A623]/30 rotate-[-2deg] shadow-lg shadow-black/20"
                            style={{ background: '#FDF6EC' }}>
                            <div className="w-full h-full flex items-center justify-center p-2 relative">
                                <Image
                                    src="/images/1774121034474.png"
                                    alt="Whole Spices"
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
