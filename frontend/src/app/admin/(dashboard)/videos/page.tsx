'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Upload, Trash2, Loader2, Video, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Product } from '@/types';

export default function VideoManagerPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [uploading, setUploading] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeUploadProductId, setActiveUploadProductId] = useState<string | null>(null);

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

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameTa.includes(searchQuery)
    );

    const handleUploadVideo = async (productId: string, file: File) => {
        // Validate type
        const allowedMimes = ['video/mp4', 'video/quicktime', 'video/webm'];
        if (!allowedMimes.includes(file.type)) {
            toast.error('Only MP4, MOV or WebM videos accepted');
            return;
        }

        // Validate size
        if (file.size > 500 * 1024 * 1024) {
            toast.error('Video must be less than 500MB');
            return;
        }

        // Warning for large files
        if (file.size > 100 * 1024 * 1024) {
            toast('Large file detected. Upload may take a few minutes.', { icon: '⚠️' });
        }

        setUploading(productId);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('video', file);

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
                xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${productId}/video`);
                const token = localStorage.getItem('token');
                if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.send(formData);
            });

            toast.success('Video uploaded successfully');
            fetchProducts();
        } catch {
            toast.error('Failed to upload video');
        } finally {
            setUploading(null);
            setUploadProgress(0);
        }
    };

    const handleDeleteVideo = async (productId: string) => {
        if (!confirm('Delete this video?')) return;
        try {
            await api.delete(`/admin/products/${productId}/video`);
            toast.success('Video deleted');
            fetchProducts();
        } catch {
            toast.error('Failed to delete video');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeUploadProductId) return;
        handleUploadVideo(activeUploadProductId, file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileInput = (productId: string) => {
        setActiveUploadProductId(productId);
        fileInputRef.current?.click();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 font-sans fade-in-up">
            <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="border-b border-[#E8E3DD] pb-6">
                <h1 className="text-2xl md:text-3xl font-serif text-[#2A2626]">Product Making Videos</h1>
                <p className="text-[14px] text-[#6B6363] mt-2 font-light">
                    Upload making/process videos for your products.
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6363]" />
                <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded border border-[#E8E3DD] bg-white text-[14px] focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all min-h-[44px]"
                />
            </div>

            {/* Products List */}
            <div className="space-y-2">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-[#6B6363]">
                        No products found.
                    </div>
                ) : filtered.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg border border-[#E8E3DD] shadow-sm overflow-hidden">
                        {/* Product Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-medium text-[#2A2626] truncate">{product.name}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {product.makingVideoUrl ? (
                                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Video uploaded
                                    </span>
                                ) : (
                                    <span className="text-[12px] font-medium text-[#6B6363] bg-[#FAF8F5] border border-[#E8E3DD] px-2.5 py-1 rounded-full">
                                        No video
                                    </span>
                                )}
                                <button
                                    onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                                    className="px-4 py-2 text-[12px] font-medium text-[#8B1A1A] border border-[#E8E3DD] rounded hover:bg-[#FAF8F5] transition-colors min-h-[44px]"
                                >
                                    Manage Video
                                </button>
                            </div>
                        </div>

                        {/* Expanded Video Panel */}
                        {expandedId === product.id && (
                            <div className="border-t border-[#E8E3DD] p-4 md:p-6 bg-[#FAF8F5]">
                                {product.makingVideoUrl ? (
                                    <div className="space-y-4">
                                        {/* Video Player */}
                                        <div className="relative w-full rounded-lg overflow-hidden border border-[#E8E3DD]"
                                            style={{ aspectRatio: '16/9' }}>
                                            <video
                                                src={product.makingVideoUrl}
                                                controls
                                                preload="metadata"
                                                playsInline
                                                className="w-full h-full object-cover bg-black"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => triggerFileInput(product.id)}
                                                disabled={uploading === product.id}
                                                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#C8962E] text-white text-[13px] font-medium rounded hover:bg-[#A17621] disabled:opacity-50 transition-all min-h-[44px]"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Replace Video
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVideo(product.id)}
                                                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#8B1A1A] text-white text-[13px] font-medium rounded hover:bg-[#661010] transition-all min-h-[44px]"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Video
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Upload Dropzone */}
                                        <button
                                            onClick={() => triggerFileInput(product.id)}
                                            disabled={uploading === product.id}
                                            className="w-full py-12 border-2 border-dashed border-[#E8E3DD] rounded-lg bg-white text-center hover:border-[#8B1A1A] transition-colors cursor-pointer"
                                        >
                                            <Video className="w-10 h-10 text-[#6B6363]/40 mx-auto mb-3" strokeWidth={1.5} />
                                            <p className="text-[14px] font-medium text-[#2A2626]">
                                                Click to upload
                                            </p>
                                            <p className="text-[12px] text-[#6B6363] mt-1">
                                                Accepted: MP4, MOV, WebM — Max size: 500MB
                                            </p>
                                        </button>
                                    </div>
                                )}

                                {/* Upload Progress */}
                                {uploading === product.id && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-[#8B1A1A]" />
                                            <span className="text-[13px] text-[#2A2626]">Uploading... {uploadProgress}%</span>
                                        </div>
                                        <div className="upload-progress">
                                            <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
