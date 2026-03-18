'use client';

import { useState, useEffect } from 'react';
import DashboardStats from '@/components/admin/DashboardStats';
import OrderTable from '@/components/admin/OrderTable';
import { DashboardStats as DashboardStatsType, Order } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStatsType | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                if (res.data.success) {
                    setStats(res.data.data.stats);
                    setRecentOrders(res.data.data.recentOrders || []);
                }
            } catch {
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto font-sans fade-in-up">
            <div className="border-b border-[#E8E3DD] pb-6">
                <h1 className="text-3xl font-serif text-[#2A2626]">Dashboard Overview</h1>
                <p className="text-[14px] text-[#6B6363] mt-2 font-light">
                    Welcome back. Here's a summary of your store's performance.
                </p>
            </div>

            {stats && <DashboardStats stats={stats} />}

            <div className="bg-white rounded-[8px] p-6 shadow-sm border border-[#E8E3DD]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E3DD]/50">
                    <h2 className="text-[16px] font-serif font-medium text-[#2A2626]">Recent Orders</h2>
                </div>
                <OrderTable orders={recentOrders} />
            </div>
        </div>
    );
}
