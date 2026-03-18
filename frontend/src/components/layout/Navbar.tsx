'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { t } = useLanguage();
    const itemCount = useCartStore((s) => s.getItemCount());
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/category/masala', label: t('masala') },
        { href: '/category/sweets', label: t('sweets') },
        { href: '/category/snacks', label: t('snacks') },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Minimalist Logo */}
                    <Link href="/" className="flex flex-col items-start gap-0.5 group shrink-0">
                        <span className="text-2xl tracking-tight text-[#8B1A1A] hover:text-[#C8962E] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Anjaraipetti
                        </span>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6363]">
                            A Pinch of Magic
                        </span>
                    </Link>

                    {/* Centered Desktop Nav */}
                    <div className="hidden lg:flex items-center justify-center flex-1 gap-8 ml-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[14px] font-medium tracking-wide transition-colors"
                                style={{ color: '#2A2626' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#C8962E'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#2A2626'}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-5 shrink-0">
                        <div className="hidden sm:block">
                            <LanguageToggle />
                        </div>

                        {isAuthenticated && (
                            <Link
                                href="/orders"
                                className="hidden sm:flex items-center gap-2 hover:opacity-75 transition-opacity"
                                style={{ color: '#2A2626' }}
                            >
                                <User className="w-4 h-4" />
                            </Link>
                        )}

                        <Link
                            href="/cart"
                            className="relative flex items-center gap-2 hover:opacity-75 transition-opacity"
                            style={{ color: '#2A2626' }}
                        >
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center"
                                    style={{ background: '#8B1A1A', color: 'white' }}>
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-1 text-[#2A2626]"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-x-0 top-[72px] bg-white border-b border-[#E8E3DD] shadow-xl p-6" style={{ maxHeight: 'calc(100vh - 72px)', overflowY: 'auto' }}>
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-[15px] font-medium"
                                    style={{ color: '#2A2626' }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-2">
                                <LanguageToggle />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
