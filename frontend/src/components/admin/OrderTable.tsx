'use client';

import { Order } from '@/types';

interface OrderTableProps {
    orders: Order[];
    onStatusUpdate?: (orderId: string, status: string) => void;
    showUser?: boolean;
}

const statusColors: Record<string, string> = {
    PLACED: 'bg-blue-50 text-blue-700 border-blue-200',
    CONFIRMED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    PROCESSING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    PENDING: 'bg-orange-50 text-orange-700 border-orange-200',
    PAID: 'bg-green-50 text-green-700 border-green-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    REFUNDED: 'bg-gray-50 text-gray-700 border-gray-200',
};

const statusOptions = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrderTable({ orders, onStatusUpdate, showUser = true }: OrderTableProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-16 text-[#6B6363] text-[13px]">
                No orders found matching the criteria.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto" id="order-table">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-[#E8E3DD]">
                        <th className="py-3 px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest whitespace-nowrap">Order #</th>
                        {showUser && <th className="py-3 px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest">Customer</th>}
                        <th className="py-3 px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest text-center">Items</th>
                        <th className="py-3 px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest">Total</th>
                        <th className="py-3 px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest">Payment</th>
                        <th className="py-3 px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest">Status</th>
                        <th className="py-3 px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest">Date</th>
                        {onStatusUpdate && <th className="py-3 px-4 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest">Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b border-[#E8E3DD]/50 hover:bg-[#FAF8F5] transition-colors">
                            <td className="py-4 px-4 font-mono text-[12px] font-medium text-[#8B1A1A]">
                                {order.orderNumber}
                            </td>
                            {showUser && (
                                <td className="py-4 px-4">
                                    <p className="text-[13px] font-medium text-[#2A2626] mb-0.5">{order.user?.name || 'Guest'}</p>
                                    <p className="text-[11px] text-[#6B6363]">{order.user?.phone || '-'}</p>
                                </td>
                            )}
                            <td className="py-4 px-4 text-[13px] text-[#6B6363] text-center">
                                {order.items?.length || 0}
                            </td>
                            <td className="py-4 px-4 text-[14px] font-medium text-[#2A2626]">
                                ₹{order.total}
                            </td>
                            <td className="py-4 px-4">
                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-medium text-[#6B6363] uppercase tracking-wider block">{order.paymentMode}</span>
                                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-[4px] border ${statusColors[order.paymentStatus] || 'bg-gray-50 text-gray-600 border-gray-200'} font-medium`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <span className={`inline-block text-[10px] px-2.5 py-1 rounded-[4px] border ${statusColors[order.orderStatus] || 'bg-gray-50 text-gray-600 border-gray-200'} font-medium tracking-wide uppercase`}>
                                    {order.orderStatus}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-[12px] text-[#6B6363]">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            {onStatusUpdate && (
                                <td className="py-4 px-4">
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                                        className="text-[11px] px-2.5 py-1.5 rounded-[4px] border border-[#E8E3DD] bg-white focus:outline-none focus:border-[#C8962E] text-[#2A2626] transition-colors cursor-pointer"
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
