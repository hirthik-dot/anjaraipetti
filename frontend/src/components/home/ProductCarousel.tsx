'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface ProductCarouselProps {
    products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
    const { t, isEnglish } = useLanguage();
    const addItem = useCartStore((s) => s.addItem);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const updateScrollButtons = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateScrollButtons);
        updateScrollButtons();
        return () => el.removeEventListener('scroll', updateScrollButtons);
    }, [updateScrollButtons]);

    // Desktop auto-scroll
    useEffect(() => {
        if (isMobile || products.length <= 4) return;
        autoScrollRef.current = setInterval(() => {
            const el = scrollRef.current;
            if (!el) return;
            const cardWidth = el.children[0]?.clientWidth || 300;
            if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
            }
        }, 4000);
        return () => {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        };
    }, [isMobile, products.length]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = el.children[0]?.clientWidth || 300;
        el.scrollBy({
            left: direction === 'left' ? -(cardWidth + 16) : cardWidth + 16,
            behavior: 'smooth',
        });
    };

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock > 0) {
            addItem(product);
            toast.success(`${isEnglish ? product.name : product.nameTa} added to cart!`);
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="py-12 md:py-20 bg-white border-y border-[#E8E3DD]" id="our-products">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Heading */}
                <h2 className="text-[22px] md:text-[32px] font-serif font-bold text-center text-[#2A2626] mb-8 md:mb-12">
                    OUR PRODUCTS
                </h2>

                {/* Carousel Wrapper */}
                <div className="relative group">
                    {/* Desktop Arrows */}
                    {!isMobile && canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 bg-white border border-[#E8E3DD] rounded flex items-center justify-center shadow-md hover:border-[#8B1A1A] transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-[#2A2626]" />
                        </button>
                    )}
                    {!isMobile && canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-11 h-11 bg-white border border-[#E8E3DD] rounded flex items-center justify-center shadow-md hover:border-[#8B1A1A] transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-[#2A2626]" />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scroll-snap-x pb-4 custom-scrollbar-hide"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="snap-start shrink-0 tap-feedback"
                                    style={{
                                        width: isMobile ? 'calc(83.33% - 8px)' : 'calc(25% - 12px)',
                                        minWidth: isMobile ? '260px' : '240px',
                                    }}
                                >
                                    <ProductCard product={product} />
                                </div>
                        ))}
                    </div>
                </div>

                {/* View More Button */}
                <div className="mt-8 text-center">
                    <Link
                        href="/category/masala"
                        className="inline-flex items-center justify-center w-full max-w-[320px] md:w-auto md:px-10 rounded-full text-white font-medium text-[14px] uppercase tracking-wider transition-all active:scale-[0.98]"
                        style={{
                            backgroundColor: '#8B1A1A',
                            height: '48px',
                        }}
                        id="view-more-products"
                    >
                        View More
                    </Link>
                </div>
            </div>
        </section>
    );
}
