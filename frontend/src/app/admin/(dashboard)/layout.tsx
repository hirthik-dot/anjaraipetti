'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAF8F5]">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between bg-[#2A2626] text-white p-4 shrink-0">
                <span className="font-serif text-[18px]">Anjaraipetti Admin</span>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 -mr-2 text-white/80 hover:text-white transition-colors">
                    {isMobileOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
                </button>
            </div>

            {/* Sidebar Desktop + Mobile Overlay */}
            <div className={`${isMobileOpen ? 'fixed inset-0 z-40 bg-black/50 lg:bg-transparent lg:static lg:block' : 'hidden lg:block'} transition-all shrink-0`}>
                <div className={`${isMobileOpen ? 'fixed inset-y-0 left-0 z-50 w-64 transform translate-x-0' : 'hidden lg:block'}`}>
                    <AdminSidebar onClose={() => setIsMobileOpen(false)} />
                </div>
                {/* Mobile BG Click area to close */}
                {isMobileOpen && <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />}
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-[100vw]">
                {children}
            </main>
        </div>
    );
}
