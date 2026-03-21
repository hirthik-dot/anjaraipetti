'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2, Upload, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { CarouselSlide } from '@/types';

export default function CarouselManagerPage() {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        headline: '',
        subtext: '',
        ctaText: 'Shop Now',
        ctaLink: '/category/masala',
        isActive: true,
    });

    const fetchSlides = async () => {
        try {
            const res = await api.get('/admin/carousel');
            setSlides(res.data?.data?.slides || []);
        } catch {
            toast.error('Failed to load slides');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlides(); }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleCreateSlide = async () => {
        if (!selectedFile) {
            toast.error('Please select an image');
            return;
        }
        if (slides.length >= 8) {
            toast.error('Maximum 8 slides allowed');
            return;
        }

        setSaving(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('headline', form.headline);
        formData.append('subtext', form.subtext);
        formData.append('ctaText', form.ctaText);
        formData.append('ctaLink', form.ctaLink);
        formData.append('isActive', String(form.isActive));

        try {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    setUploadProgress(Math.round((e.loaded / e.total) * 100));
                }
            };

            await new Promise<void>((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error('Upload failed'));
                    }
                };
                xhr.onerror = () => reject(new Error('Upload failed'));
                xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/admin/carousel`);
                const token = localStorage.getItem('token');
                if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.send(formData);
            });

            toast.success('Slide created');
            setShowForm(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            setForm({ headline: '', subtext: '', ctaText: 'Shop Now', ctaLink: '/category/masala', isActive: true });
            fetchSlides();
        } catch {
            toast.error('Failed to create slide');
        } finally {
            setSaving(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this slide?')) return;
        try {
            await api.delete(`/admin/carousel/${id}`);
            toast.success('Slide deleted');
            fetchSlides();
        } catch {
            toast.error('Failed to delete slide');
        }
    };

    const handleToggle = async (slide: CarouselSlide) => {
        try {
            await api.put(`/admin/carousel/${slide.id}`, { isActive: !slide.isActive });
            fetchSlides();
        } catch {
            toast.error('Failed to update slide');
        }
    };

    const handleReorder = async (index: number, direction: 'up' | 'down') => {
        const newSlides = [...slides];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newSlides.length) return;

        [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];

        try {
            await api.put('/admin/carousel/reorder', {
                slideIds: newSlides.map(s => s.id),
            });
            setSlides(newSlides);
        } catch {
            toast.error('Failed to reorder');
        }
    };

    const inputClass = "w-full px-4 py-3 rounded border border-[#E8E3DD] bg-[#FAF8F5] text-[#2A2626] text-[14px] focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all min-h-[44px]";
    const labelClass = "text-[11px] font-semibold text-[#6B6363] mb-2 block uppercase tracking-wider";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 font-sans fade-in-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E3DD] pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-[#2A2626]">Homepage Carousel Manager</h1>
                    <p className="text-[14px] text-[#6B6363] mt-2 font-light">
                        {slides.length}/8 slides
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#8B1A1A] text-white text-[13px] font-medium uppercase tracking-wider rounded hover:bg-[#661010] transition-all min-h-[44px]"
                >
                    <Plus className="w-4 h-4" />
                    Add New Slide
                </button>
            </div>

            {/* Add New Slide Form */}
            {showForm && (
                <div className="bg-white p-5 md:p-8 rounded-lg border border-[#E8E3DD] shadow-sm space-y-5">
                    <h3 className="text-[16px] font-serif font-medium text-[#2A2626]">New Slide</h3>

                    {/* Image Upload */}
                    <div>
                        <label className={labelClass}>Slide Image *</label>
                        <input ref={fileInputRef} type="file" accept=".jpg,.png,.webp" onChange={handleFileSelect} className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 px-5 py-3 bg-[#FAF8F5] border border-dashed border-[#E8E3DD] rounded text-[13px] text-[#6B6363] hover:border-[#8B1A1A] transition-colors w-full justify-center min-h-[44px]"
                        >
                            <Upload className="w-5 h-5" />
                            {selectedFile ? selectedFile.name : 'Click to upload image'}
                        </button>
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="mt-3 rounded border border-[#E8E3DD]" style={{ width: '160px', height: '90px', objectFit: 'cover' }} />
                        )}
                    </div>

                    {/* Headline */}
                    <div>
                        <label className={labelClass}>Headline ({form.headline.length}/60)</label>
                        <input
                            type="text"
                            value={form.headline}
                            onChange={e => setForm(f => ({ ...f, headline: e.target.value.slice(0, 60) }))}
                            className={inputClass}
                            placeholder="e.g. Fresh Masalas Arrived!"
                        />
                    </div>

                    {/* Subtext */}
                    <div>
                        <label className={labelClass}>Subtext ({form.subtext.length}/120)</label>
                        <textarea
                            value={form.subtext}
                            onChange={e => setForm(f => ({ ...f, subtext: e.target.value.slice(0, 120) }))}
                            className={`${inputClass} min-h-[80px] resize-y`}
                            placeholder="Short description..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>CTA Button Text</label>
                            <input
                                type="text"
                                value={form.ctaText}
                                onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>CTA Button Link</label>
                            <input
                                type="text"
                                value={form.ctaLink}
                                onChange={e => setForm(f => ({ ...f, ctaLink: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                            className={`toggle-switch ${form.isActive ? 'active' : ''}`}
                        />
                        <span className="text-[13px] text-[#2A2626]">Active</span>
                    </div>

                    {/* Progress */}
                    {saving && (
                        <div className="upload-progress">
                            <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    )}

                    <button
                        onClick={handleCreateSlide}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-[#218F5B] text-white text-[13px] font-medium uppercase tracking-wider rounded hover:bg-[#1a7048] disabled:opacity-50 transition-all min-h-[44px]"
                    >
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {saving ? 'Creating...' : 'Save Slide'}
                    </button>
                </div>
            )}

            {/* Slides List */}
            <div className="space-y-3">
                {slides.length === 0 ? (
                    <div className="text-center py-16 text-[#6B6363]">
                        No slides yet. Add your first slide above.
                    </div>
                ) : slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className="bg-white p-4 md:p-5 rounded-lg border border-[#E8E3DD] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded border border-[#E8E3DD] overflow-hidden shrink-0 bg-[#FAF8F5]">
                            <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[12px] font-bold text-[#6B6363]">Slide {index + 1}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                                    slide.isActive
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                                }`}>
                                    {slide.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-[14px] text-[#2A2626] truncate">{slide.headline || 'No headline'}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => handleReorder(index, 'up')}
                                disabled={index === 0}
                                className="w-9 h-9 flex items-center justify-center rounded border border-[#E8E3DD] bg-white text-[#6B6363] hover:border-[#8B1A1A] disabled:opacity-30 transition-colors"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleReorder(index, 'down')}
                                disabled={index === slides.length - 1}
                                className="w-9 h-9 flex items-center justify-center rounded border border-[#E8E3DD] bg-white text-[#6B6363] hover:border-[#8B1A1A] disabled:opacity-30 transition-colors"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleToggle(slide)}
                                className="w-9 h-9 flex items-center justify-center rounded border border-[#E8E3DD] bg-white text-[#6B6363] hover:border-[#C8962E] transition-colors"
                                title={slide.isActive ? 'Deactivate' : 'Activate'}
                            >
                                {slide.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => handleDelete(slide.id)}
                                className="w-9 h-9 flex items-center justify-center rounded border border-[#E8E3DD] bg-white text-[#6B6363] hover:border-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
