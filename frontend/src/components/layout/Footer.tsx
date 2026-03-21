'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden border-b border-[#FFFFFF]/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 px-2 min-h-[44px]"
            >
                <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.15em] text-[#FFFFFF]">
                    {title}
                </h4>
                <ChevronDown
                    className={`w-5 h-5 text-[#6B6363] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div className={`footer-accordion-content ${isOpen ? 'open' : ''}`}>
                <div className="pb-4 px-2">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function Footer() {
    const { t } = useLanguage();

    const quickLinks = [
        { href: '/', label: t('home') },
        { href: '/category/masala', label: t('masala') },
        { href: '/category/sweets', label: t('sweets') },
        { href: '/category/snacks', label: t('snacks') },
    ];

    const infoLinks = [
        { href: '/about', label: t('about') },
        { href: '/contact', label: t('contact') },
        { href: '/shipping', label: t('shippingPolicy') },
        { href: '/terms', label: t('termsOfService') },
    ];

    const socialIcons = [
        { Icon: Instagram, href: '#', label: 'Instagram' },
        { Icon: Facebook, href: '#', label: 'Facebook' },
        { Icon: Twitter, href: '#', label: 'Twitter' },
    ];

    return (
        <footer id="main-footer" className="bg-[#2A2626] text-[#FFFFFF]/70 py-12 md:py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12">
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
                            {socialIcons.map(({ Icon, href, label }) => (
                                <a key={label} href={href}
                                    className="w-11 h-11 rounded-full border border-[#FFFFFF]/10 flex items-center justify-center transition-all duration-300 hover:bg-[#C8962E] hover:border-[#C8962E] hover:text-[#FFFFFF]"
                                    aria-label={label}
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
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="hover:text-[#C8962E] transition-colors min-h-[44px] inline-flex items-center">
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
                                {infoLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="hover:text-[#C8962E] transition-colors min-h-[44px] inline-flex items-center">
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

                {/* Mobile Layout - Accordion */}
                <div className="md:hidden">
                    {/* Brand */}
                    <div className="text-center mb-8 pb-8 border-b border-[#FFFFFF]/10">
                        <Link href="/" className="inline-block mb-4">
                            <h3 className="text-2xl font-serif text-[#FFFFFF]">Anjaraipetti</h3>
                            <p className="text-[9px] tracking-[0.2em] uppercase text-[#6B6363] mt-1">A Pinch of Magic</p>
                        </Link>
                        <p className="text-[13px] leading-relaxed text-[#AFA8A3] max-w-xs mx-auto mb-6">
                            {t('footerDesc')}
                        </p>
                        <div className="flex justify-center gap-4">
                            {socialIcons.map(({ Icon, href, label }) => (
                                <a key={label} href={href}
                                    className="w-11 h-11 rounded-full border border-[#FFFFFF]/10 flex items-center justify-center transition-all duration-300 active:bg-[#C8962E] active:border-[#C8962E]"
                                    aria-label={label}
                                >
                                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Accordion Sections */}
                    <FooterAccordion title={t('quickLinks')}>
                        <ul className="space-y-1">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="block py-2 text-[14px] text-[#AFA8A3] active:text-[#C8962E]">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </FooterAccordion>

                    <FooterAccordion title="Information">
                        <ul className="space-y-1">
                            {infoLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="block py-2 text-[14px] text-[#AFA8A3] active:text-[#C8962E]">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </FooterAccordion>

                    <FooterAccordion title={t('contactUs')}>
                        <ul className="space-y-4 text-[14px] text-[#AFA8A3]">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 shrink-0 opacity-50" strokeWidth={1.5} />
                                <span>Authentic Kitchens, Tamil Nadu, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 shrink-0 opacity-50" strokeWidth={1.5} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 shrink-0 opacity-50" strokeWidth={1.5} />
                                <span>hello@anjaraipetti.com</span>
                            </li>
                        </ul>
                    </FooterAccordion>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 md:mt-24 pt-8 border-t border-[#FFFFFF]/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[13px] font-light text-center text-[#AFA8A3]">
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
