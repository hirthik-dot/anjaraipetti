'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Order } from '@/types';
import api from '@/lib/api';

const statusColors: Record<string, string> = {
    PLACED: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-indigo-100 text-indigo-700',
    PROCESSING: 'bg-yellow-100 text-yellow-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
    const { t, isEnglish } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my');
                setOrders(res.data?.data?.orders || []);
            } catch {
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-heading font-bold text-[--color-brown] mb-8">{t('orderHistory')}</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[--color-cream] border-t-[--color-primary] rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-[--color-brown]/15 mx-auto mb-4" />
                        <p className="text-[--color-brown]/50 mb-6">{t('noOrders')}</p>
                        <Link href="/" className="px-6 py-3 bg-[--color-primary] text-white font-semibold rounded-xl hover:bg-[--color-primary-light] transition-colors">
                            {t('startShopping')}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-mono text-sm font-bold text-[--color-primary]">{order.orderNumber}</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-[--color-brown]/50">
                                            <Clock className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-[--color-brown]/60">
                                        {order.items?.length || 0} items • {order.paymentMode}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-bold text-[--color-brown]">₹{order.total}</span>
                                        <ChevronRight className="w-5 h-5 text-[--color-brown]/30" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
