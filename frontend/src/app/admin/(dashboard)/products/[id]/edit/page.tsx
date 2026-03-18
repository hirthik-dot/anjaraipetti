'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { Category, Product } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [categories, setCategories] = useState<Category[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/categories'),
            api.get(`/products/${id}`),
        ]).then(([catRes, prodRes]) => {
            setCategories(catRes.data?.data?.categories || []);
            setProduct(prodRes.data?.data?.product || null);
        }).catch(() => {
            toast.error('Failed to load product');
        }).finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await api.put(`/admin/products/${id}`, data);
            toast.success('Product updated successfully!');
            router.push('/admin/products');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-[--color-cream] border-t-[--color-primary] rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-20 text-[--color-brown]/50">Product not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-[--color-cream] transition-colors shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[--color-brown]">Edit Product</h1>
                    <p className="text-[--color-brown]/50 mt-1">{product.name}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <ProductForm
                    categories={categories}
                    initialValues={{
                        name: product.name,
                        nameTa: product.nameTa,
                        description: product.description,
                        descTa: product.descTa,
                        price: product.price,
                        mrp: product.mrp,
                        stock: product.stock,
                        weight: product.weight,
                        categoryId: product.categoryId,
                        images: product.images,
                        isActive: product.isActive,
                        isFeatured: product.isFeatured,
                    }}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
