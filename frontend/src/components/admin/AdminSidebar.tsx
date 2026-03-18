'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ChefHat } from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/products', icon: Package, label: 'Products' },
        { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { href: '/admin/customers', icon: Users, label: 'Customers' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'adminToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/admin/login';
    };

    return (
        <aside className="w-64 min-h-screen bg-[#2A2626] text-white flex flex-col shrink-0 font-sans" id="admin-sidebar">
            {/* Elegant Header */}
            <div className="p-6 border-b border-[#E8E3DD]/10 fade-in-up">
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#E8E3DD]/20 flex items-center justify-center bg-[#FFFFFF]/5">
                        <ChefHat className="w-5 h-5 text-[#C8962E]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-serif text-[#FFFFFF]">Anjaraipetti</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C8962E]">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 fade-in-up delay-1">
                <div className="px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest mb-4 mt-2 block">
                    Menu
                </div>
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-[6px] text-[13px] font-medium transition-all duration-300 ${
                                isActive
                                    ? 'bg-[#C8962E] text-[#2A2626] shadow-md shadow-[#C8962E]/20'
                                    : 'text-[#FFFFFF]/60 hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/5'
                            }`}
                        >
                            <link.icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="p-4 border-t border-[#E8E3DD]/10 fade-in-up delay-2">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-[6px] text-[13px] font-medium text-[#FFFFFF]/50 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
                    id="admin-logout"
                >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    Secure Logout
                </button>
            </div>
        </aside>
    );
}
