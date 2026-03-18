'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    createdAt: string;
    _count: { orders: number };
    orders: Array<{ createdAt: string; total: number }>;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/admin/customers');
                setCustomers(res.data?.data?.customers || []);
            } catch {
                toast.error('Failed to load customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
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
                <h1 className="text-3xl font-serif text-[#2A2626]">Customers</h1>
                <p className="text-[14px] text-[#6B6363] mt-2 font-light">Directory of {customers.length} registered customers.</p>
            </div>

            <div className="bg-white rounded-[8px] border border-[#E8E3DD] overflow-hidden shadow-sm shadow-[#2A2626]/5">
                {customers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-10 h-10 text-[#6B6363]/20 mx-auto mb-4" strokeWidth={1} />
                        <p className="text-[14px] text-[#6B6363]">No customers have registered yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#FAF8F5]">
                                <tr className="border-b border-[#E8E3DD]">
                                    <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest whitespace-nowrap border-r border-[#E8E3DD]/50">Customer</th>
                                    <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest border-r border-[#E8E3DD]/50">Phone</th>
                                    <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest border-r border-[#E8E3DD]/50">Email</th>
                                    <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest border-r border-[#E8E3DD]/50 text-center">Orders</th>
                                    <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-[#E8E3DD]/50 hover:bg-[#FAF8F5] transition-colors">
                                        <td className="py-4 px-6 border-r border-[#E8E3DD]/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E8E3DD] flex items-center justify-center text-[#8B1A1A] font-medium text-[14px]">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-[14px] font-medium text-[#2A2626]">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-[13px] text-[#6B6363] border-r border-[#E8E3DD]/50">{customer.phone}</td>
                                        <td className="py-4 px-6 text-[13px] text-[#6B6363] border-r border-[#E8E3DD]/50">{customer.email || '-'}</td>
                                        <td className="py-4 px-6 text-center border-r border-[#E8E3DD]/50">
                                            <span className="inline-block px-2.5 py-1 bg-[#FAF8F5] border border-[#E8E3DD] text-[#2A2626] text-[11px] font-medium rounded-[4px]">
                                                {customer._count?.orders || 0}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-[12px] text-[#6B6363]">
                                            {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
