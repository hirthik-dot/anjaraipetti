'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { SiteSettings } from '@/types';
import api from '@/lib/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { t } = useLanguage();
  const itemCount = useCartStore((s) => s.getItemCount());
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch logo from site settings
    const fetchLogo = async () => {
      try {
        const res = await api.get('/site-settings');
        const settings: SiteSettings = res.data?.data?.settings;
        if (settings?.logoUrl) {
          setLogoUrl(settings.logoUrl);
        }
      } catch {
        // Use default logo
      }
    };
    fetchLogo();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on outside tap
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/category/masala', label: t('masala') },
    { href: '/category/sweets', label: t('sweets') },
    { href: '/category/snacks', label: t('snacks') },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-2' : 'bg-transparent py-3 md:py-5'}`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 min-h-[44px]">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Anjaraipetti"
                width={140}
                height={40}
                className="object-contain"
                style={{ maxHeight: '40px', width: 'auto' }}
                priority
              />
            ) : (
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-xl md:text-2xl tracking-tight text-[#8B1A1A] hover:text-[#C8962E] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Anjaraipetti
                </span>
                <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#6B6363]">
                  A Pinch of Magic
                </span>
              </div>
            )}
          </Link>

          {/* Centered Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-8 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium tracking-wide transition-colors min-h-[44px] flex items-center"
                style={{ color: '#2A2626' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#C8962E'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2A2626'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {isAuthenticated && (
              <Link
                href="/orders"
                className="hidden sm:flex items-center gap-2 hover:opacity-75 transition-opacity min-w-[44px] min-h-[44px] justify-center"
                style={{ color: '#2A2626' }}
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/cart"
              className="relative flex items-center gap-2 hover:opacity-75 transition-opacity min-w-[44px] min-h-[44px] justify-center"
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

            {/* Hamburger - Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#2A2626] min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div className="lg:hidden fixed inset-0 bg-black/30 z-40" style={{ top: '0' }} />
            {/* Drawer */}
            <div
              ref={drawerRef}
              className="lg:hidden fixed inset-x-0 z-50 bg-white border-b border-[#E8E3DD] shadow-2xl"
              style={{ top: isScrolled ? '52px' : '56px', maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}
              id="mobile-drawer"
            >
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-6 text-[18px] font-medium border-b border-[#E8E3DD]/50 text-[#2A2626] active:bg-[#FAF8F5] transition-colors"
                    style={{ height: '56px', minHeight: '56px' }}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 text-[18px] font-medium border-b border-[#E8E3DD]/50 text-[#2A2626] active:bg-[#FAF8F5]"
                    style={{ height: '56px', minHeight: '56px' }}
                  >
                    <User className="w-5 h-5" />
                    My Orders
                  </Link>
                )}
                <div className="px-6 py-4 border-b border-[#E8E3DD]/50">
                  <LanguageToggle />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
