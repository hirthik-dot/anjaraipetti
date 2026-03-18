'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { Category } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data?.data?.categories || [])).catch(() => {});
    }, []);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await api.post('/admin/products', data);
            toast.success('Product created successfully!');
            router.push('/admin/products');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-[--color-cream] transition-colors shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[--color-brown]">New Product</h1>
                    <p className="text-[--color-brown]/50 mt-1">Create a new product</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <ProductForm categories={categories} onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
}
