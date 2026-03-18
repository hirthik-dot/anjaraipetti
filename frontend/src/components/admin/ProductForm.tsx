'use client';

import { useState, useRef } from 'react';
import { Category } from '@/types';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ProductFormProps {
    categories: Category[];
    initialValues?: {
        name: string;
        nameTa: string;
        description: string;
        descTa: string;
        price: number;
        mrp: number;
        stock: number;
        weight: string;
        categoryId: string;
        images: string[];
        isActive: boolean;
        isFeatured: boolean;
    };
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

const defaultValues = {
    name: '', nameTa: '', description: '', descTa: '',
    price: 0, mrp: 0, stock: 0, weight: '',
    categoryId: '', images: [] as string[], isActive: true, isFeatured: false,
};

export default function ProductForm({ categories, initialValues, onSubmit, isLoading }: ProductFormProps) {
    const [values, setValues] = useState(initialValues || defaultValues);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: string, value: any) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setIsUploading(true);
        try {
            const res = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (res.data?.success && res.data?.data?.url) {
                setValues((prev) => ({ ...prev, images: [...prev.images, res.data.data.url] }));
                toast.success('Image uploaded');
            } else {
                toast.error('Failed to get image URL');
            }
        } catch (error: any) {
            console.error('Upload Error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = async (index: number) => {
        const imageUrl = values.images[index];
        // Note: For a complete system, we should ideally call `api.delete('/upload/image', { data: { imageUrl }})` 
        // to delete the file from Cloudinary as well. But just removing from form state is fine for now.
        setValues((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...values,
            price: Number(values.price),
            mrp: Number(values.mrp),
            stock: Number(values.stock),
        });
    };

    const inputClass = "w-full px-4 py-3 rounded-[4px] border border-[#E8E3DD] bg-[#FAF8F5] text-[#2A2626] text-[13px] focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all";
    const labelClass = "text-[11px] font-semibold text-[#6B6363] mb-2 block uppercase tracking-wider";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-[#E8E3DD] shadow-sm shadow-[#2A2626]/5 rounded-[8px]" id="product-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className={labelClass}>Name (English) *</label>
                    <input type="text" value={values.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} placeholder="e.g. Sambar Powder" required />
                </div>
                <div>
                    <label className={labelClass}>Name (Tamil) *</label>
                    <input type="text" value={values.nameTa} onChange={(e) => handleChange('nameTa', e.target.value)} className={inputClass} placeholder="e.g. சாம்பார் பொடி" required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className={labelClass}>Description (English) *</label>
                    <textarea value={values.description} onChange={(e) => handleChange('description', e.target.value)} className={`${inputClass} min-h-[120px] resize-y`} required />
                </div>
                <div>
                    <label className={labelClass}>Description (Tamil) *</label>
                    <textarea value={values.descTa} onChange={(e) => handleChange('descTa', e.target.value)} className={`${inputClass} min-h-[120px] resize-y`} required />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <label className={labelClass}>Price (₹) *</label>
                    <input type="number" value={values.price} onChange={(e) => handleChange('price', e.target.value)} className={inputClass} min="0" step="0.01" required />
                </div>
                <div>
                    <label className={labelClass}>MRP (₹) *</label>
                    <input type="number" value={values.mrp} onChange={(e) => handleChange('mrp', e.target.value)} className={inputClass} min="0" step="0.01" required />
                </div>
                <div>
                    <label className={labelClass}>Stock *</label>
                    <input type="number" value={values.stock} onChange={(e) => handleChange('stock', e.target.value)} className={inputClass} min="0" required />
                </div>
                <div>
                    <label className={labelClass}>Weight *</label>
                    <input type="text" value={values.weight} onChange={(e) => handleChange('weight', e.target.value)} className={inputClass} placeholder="e.g. 200g" required />
                </div>
            </div>

            <div>
                <label className={labelClass}>Category *</label>
                <select value={values.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} className={`${inputClass} appearance-none cursor-pointer`} style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'1.5\' stroke=\'%236B6363\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9\' /%3E%3C/svg%3E")', backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px', paddingRight: '40px' }} required>
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} / {c.nameTa}</option>
                    ))}
                </select>
            </div>

            {/* Device Image Upload */}
            <div className="p-6 border border-[#E8E3DD] rounded-[8px] bg-[#FAF8F5]">
                <label className={labelClass}>Product Images</label>
                
                <div className="flex flex-col gap-4 mt-2">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        ref={fileInputRef} 
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isUploading}
                        className="w-full sm:w-auto self-start px-6 py-4 bg-white border border-[#E8E3DD] text-[#2A2626] font-medium text-[12px] uppercase tracking-wider rounded-[4px] hover:border-[#8B1A1A] transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" strokeWidth={1.5} />}
                        {isUploading ? 'Uploading Image...' : 'Upload from Device'}
                    </button>
                    <p className="text-[10px] text-[#6B6363] uppercase tracking-widest mt-1">Recommended: Square format, max 5MB</p>
                </div>

                {values.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#E8E3DD]">
                        {values.images.map((img, i) => (
                            <div key={i} className="relative group rounded-[4px] overflow-hidden border border-[#E8E3DD]">
                                <img src={img} alt="" className="w-24 h-24 object-cover" />
                                <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-[#8B1A1A]/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-6 h-6" strokeWidth={1.5} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Toggles */}
            <div className="flex gap-10 pt-4 border-t border-[#E8E3DD]">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${values.isActive ? 'bg-[#8B1A1A] border-[#8B1A1A]' : 'bg-white border-[#E8E3DD] group-hover:border-[#8B1A1A]'}`}>
                        {values.isActive && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                    </div>
                    <input type="checkbox" checked={values.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} className="hidden" />
                    <span className="text-[13px] font-medium text-[#2A2626]">Active Listing</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${values.isFeatured ? 'bg-[#C8962E] border-[#C8962E]' : 'bg-white border-[#E8E3DD] group-hover:border-[#C8962E]'}`}>
                        {values.isFeatured && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                    </div>
                    <input type="checkbox" checked={values.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} className="hidden" />
                    <span className="text-[13px] font-medium text-[#2A2626]">Featured Product</span>
                </label>
            </div>

            <div className="pt-6 border-t border-[#E8E3DD]">
                <button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="w-full sm:w-auto px-10 py-3.5 bg-[#8B1A1A] text-white text-[13px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#661010] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? 'Saving Changes...' : initialValues ? 'Save Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}
