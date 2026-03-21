'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface HeroBannerProps {
  slides?: any[];
}

export default function HeroBanner({ slides = [] }: HeroBannerProps) {
  const { t } = useLanguage();

  const defaultSlide = {
    id: 'default',
    title: t('heroTitle'),
    subtitle: t('heroSubtitle'),
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2670&auto=format&fit=crop',
    linkUrl: '/category/masala'
  };

  const activeSlides = slides && slides.length > 0 
    ? slides.filter(s => s.isActive) 
    : [defaultSlide];

  const displaySlides = activeSlides.length > 0 ? activeSlides : [defaultSlide];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FAF8F5] overflow-hidden pt-8 slider-pagination-container">
      {/* Minimal Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[#F3EEEA] rounded-bl-[120px] transform translate-x-10 -translate-y-10 transition-transform duration-1000" />
      </div>

      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={displaySlides.length > 1}
        className="w-full h-full z-10"
      >
        {displaySlides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full min-h-[85vh] flex items-center">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full">

                {/* Text Column */}
                <div className="flex-1 max-w-2xl fade-in-up delay-1">
                  <div className="inline-block px-3 py-1 mb-6 text-[11px] font-semibold tracking-[0.2em] uppercase border border-[#E8E3DD] rounded-full text-[#6B6363]">
                    {t('homemade')} — {t('noPreservatives')}
                  </div>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-serif font-medium leading-[1.05] text-[#2A2626] mb-6 tracking-tight line-clamp-3">
                    {slide.title || t('heroTitle')}
                  </h1>

                  <p className="text-xl sm:text-2xl font-serif italic text-[#8B1A1A] mb-8 line-clamp-2">
                    {slide.subtitle || t('heroSubtitle')}
                  </p>

                  <p className="text-[17px] text-[#6B6363] leading-relaxed max-w-lg mb-12">
                    {t('heroDesc')}
                  </p>

                  <div className="flex flex-wrap items-center gap-6">
                    <Link href={slide.linkUrl || '/category/masala'} className="btn-primary">
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
                      src={slide.imageUrl || defaultSlide.imageUrl}
                      alt={slide.title || 'Authentic Indian Spices'}
                      fill
                      className="object-cover"
                      priority={index === 0}
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
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
