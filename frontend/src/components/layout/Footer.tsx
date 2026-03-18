'use client';

import Link from 'next/link';
import { ChefHat, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer id="main-footer" className="bg-[#2A2626] text-[#FFFFFF]/70 py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12">
                    
                    {/* Brand Col */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block mb-8 group">
                            <h3 className="text-3xl font-serif text-[#FFFFFF] group-hover:text-[#C8962E] transition-colors">
                                Anjaraipetti
                            </h3>
                            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6B6363] mt-1">
                                A Pinch of Magic
                            </p>
                        </Link>
                        <p className="text-[14px] leading-relaxed max-w-sm font-light mb-10 text-[#AFA8A3]">
                            {t('footerDesc')}
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <a key={i} href="#"
                                    className="w-10 h-10 rounded-full border border-[#FFFFFF]/10 flex items-center justify-center transition-all duration-300 hover:bg-[#C8962E] hover:border-[#C8962E] hover:text-[#FFFFFF]"
                                >
                                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 text-[#FFFFFF]">
                                {t('quickLinks')}
                            </h4>
                            <ul className="space-y-4 font-light text-[14px]">
                                {[
                                    { href: '/', label: t('home') },
                                    { href: '/category/masala', label: t('masala') },
                                    { href: '/category/sweets', label: t('sweets') },
                                    { href: '/category/snacks', label: t('snacks') },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="hover:text-[#C8962E] transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 text-[#FFFFFF]">
                                Information
                            </h4>
                            <ul className="space-y-4 font-light text-[14px]">
                                {[
                                    { href: '/about', label: t('about') },
                                    { href: '/contact', label: t('contact') },
                                    { href: '/shipping', label: t('shippingPolicy') },
                                    { href: '/terms', label: t('termsOfService') },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="hover:text-[#C8962E] transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-4">
                        <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 text-[#FFFFFF]">
                            {t('contactUs')}
                        </h4>
                        <ul className="space-y-5 font-light text-[14px] text-[#AFA8A3]">
                            <li className="flex items-start gap-4 group">
                                <MapPin className="w-5 h-5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-[#C8962E] transition-all" strokeWidth={1.5} />
                                <span>Authentic Kitchens, Tamil Nadu, India</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <Phone className="w-5 h-5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-[#C8962E] transition-all" strokeWidth={1.5} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <Mail className="w-5 h-5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-[#C8962E] transition-all" strokeWidth={1.5} />
                                <span>hello@anjaraipetti.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-8 border-t border-[#FFFFFF]/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[12px] font-light text-[#AFA8A3]">
                        © {new Date().getFullYear()} Anjaraipetti. {t('allRightsReserved')}
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-widest text-[#6B6363]">Payments</span>
                        <span className="text-[12px] font-medium text-[#FFFFFF]">Razorpay</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
