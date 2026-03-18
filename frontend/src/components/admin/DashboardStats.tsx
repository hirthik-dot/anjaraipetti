'use client';

import { Package, ShoppingBag, Users, IndianRupee, TrendingUp } from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '@/types';

interface DashboardStatsProps {
    stats: DashboardStatsType;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    const cards = [
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: '#C8962E', bg: '#C8962E08', border: '#C8962E20' },
        { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: '#2A2626', bg: '#2A262608', border: '#2A262615' },
        { label: 'Today Actions', value: stats.todayOrders.toString(), icon: TrendingUp, color: '#8B1A1A', bg: '#8B1A1A08', border: '#8B1A1A15' },
        { label: 'Active Products', value: stats.totalProducts.toString(), icon: Package, color: '#6B6363', bg: '#6B636308', border: '#6B636315' },
        { label: 'Total Customers', value: stats.totalCustomers.toString(), icon: Users, color: '#2A2626', bg: '#2A262608', border: '#2A262615' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 fade-in-up delay-1" id="dashboard-stats">
            {cards.map((card, i) => (
                <div key={i} className="bg-white rounded-[8px] p-6 shadow-sm shadow-[#2A2626]/5 border border-[#E8E3DD] transition-all hover:bg-[#FAF8F5]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: card.bg, borderColor: card.border }}>
                            <card.icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={1.5} />
                        </div>
                        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#6B6363]">{card.label}</p>
                    </div>
                    <p className="text-3xl font-serif text-[#2A2626] font-medium">{card.value}</p>
                </div>
            ))}
        </div>
    );
}
