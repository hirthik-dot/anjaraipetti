'use client';

import { useState, useEffect } from 'react';
import OrderTable from '@/components/admin/OrderTable';
import { Order } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async () => {
        try {
            const params = statusFilter ? `?status=${statusFilter}` : '';
            const res = await api.get(`/admin/orders${params}`);
            setOrders(res.data?.data?.orders || []);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [statusFilter]);

    const handleStatusUpdate = async (orderId: string, status: string) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { orderStatus: status });
            toast.success('Order status updated');
            fetchOrders();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const statuses = ['', 'PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    return (
        <div className="space-y-10 max-w-7xl mx-auto font-sans fade-in-up">
            <div className="flex items-center justify-between border-b border-[#E8E3DD] pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-[#2A2626]">Orders</h1>
                    <p className="text-[14px] text-[#6B6363] mt-2 font-light">Manage and process {orders.length} orders.</p>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-[4px] border border-[#E8E3DD] bg-white text-[13px] text-[#2A2626] font-medium uppercase tracking-wider focus:outline-none focus:border-[#C8962E] appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%236B6363\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19.5 8.25l-7.5 7.5-7.5-7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px', paddingRight: '40px' }}
                >
                    {statuses.map((s) => (
                        <option key={s} value={s}>{s || 'All Status'}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-[8px] border border-[#E8E3DD] overflow-hidden shadow-sm shadow-[#2A2626]/5">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
                    </div>
                ) : (
                    <OrderTable orders={orders} onStatusUpdate={handleStatusUpdate} />
                )}
            </div>
        </div>
    );
}
