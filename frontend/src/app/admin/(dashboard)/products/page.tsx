'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Product } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/admin/products');
            setProducts(res.data?.data?.products || []);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleDelete = async (id: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Are you sure you want to deactivate this product?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            toast.success('Product deactivated');
            fetchProducts();
        } catch {
            toast.error('Failed to delete product');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto font-sans fade-in-up">
            <div className="flex items-center justify-between border-b border-[#E8E3DD] pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-[#2A2626]">Products</h1>
                    <p className="text-[14px] text-[#6B6363] mt-2 font-light">
                        {products.length} products total in your catalog.
                    </p>
                </div>
                <Link href="/admin/products/new" className="flex items-center gap-2 px-6 py-3 bg-[#8B1A1A] text-white text-[13px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#661010] active:scale-[0.98] transition-all">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-[8px] border border-[#E8E3DD] overflow-hidden shadow-sm shadow-[#2A2626]/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FAF8F5]">
                            <tr className="border-b border-[#E8E3DD]">
                                <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest whitespace-nowrap border-r border-[#E8E3DD]/50">Product</th>
                                <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest border-r border-[#E8E3DD]/50">Category</th>
                                <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest border-r border-[#E8E3DD]/50">Price</th>
                                <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest border-r border-[#E8E3DD]/50">Stock</th>
                                <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest border-r border-[#E8E3DD]/50">Status</th>
                                <th className="py-4 px-6 text-[10px] font-semibold text-[#6B6363] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-[#6B6363] text-[13px]">
                                        No products found in catalog.
                                    </td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="border-b border-[#E8E3DD]/50 hover:bg-[#FAF8F5] transition-colors group">
                                    <td className="py-4 px-6 border-r border-[#E8E3DD]/50">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-[4px] border border-[#E8E3DD] overflow-hidden shrink-0 bg-[#FAF8F5]">
                                                {product.images[0] ? (
                                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-[#6B6363]/40" strokeWidth={1.5} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-medium text-[#2A2626] mb-0.5">{product.name}</p>
                                                <p className="text-[12px] text-[#6B6363]">{product.nameTa}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-[13px] text-[#6B6363] border-r border-[#E8E3DD]/50">{product.category?.name || '-'}</td>
                                    <td className="py-4 px-6 border-r border-[#E8E3DD]/50">
                                        <span className="text-[14px] font-medium text-[#2A2626] block">₹{product.price}</span>
                                        {product.mrp > product.price && <span className="text-[11px] text-[#8B1A1A] line-through block mt-0.5">₹{product.mrp}</span>}
                                    </td>
                                    <td className="py-4 px-6 border-r border-[#E8E3DD]/50">
                                        <span className={`text-[13px] font-medium ${product.stock <= 5 ? 'text-[#8B1A1A]' : 'text-[#6B6363]'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 border-r border-[#E8E3DD]/50">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            {product.isActive ? (
                                                <span className="inline-block text-[10px] px-2 py-0.5 rounded-[4px] border border-green-200 bg-green-50 text-green-700 font-medium uppercase tracking-wider">Active</span>
                                            ) : (
                                                <span className="inline-block text-[10px] px-2 py-0.5 rounded-[4px] border border-[#E8E3DD] bg-[#FAF8F5] text-[#6B6363] font-medium uppercase tracking-wider">Inactive</span>
                                            )}
                                            {product.isFeatured && (
                                                <span className="inline-block text-[10px] px-2 py-0.5 rounded-[4px] border border-[#C8962E]/30 bg-[#C8962E]/10 text-[#C8962E] font-medium uppercase tracking-wider">Featured</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/products/${product.id}/edit`} className="w-8 h-8 rounded-[4px] border border-[#E8E3DD] bg-white flex items-center justify-center hover:border-[#C8962E] hover:text-[#C8962E] text-[#6B6363] transition-colors">
                                                <Edit className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-[4px] border border-[#E8E3DD] bg-white flex items-center justify-center hover:border-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white text-[#6B6363] transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
