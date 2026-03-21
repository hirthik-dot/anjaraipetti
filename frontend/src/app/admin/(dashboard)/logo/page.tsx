'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, RotateCcw } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LogoManagerPage() {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/site-settings');
                setLogoUrl(res.data?.data?.settings?.logoUrl || null);
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
        if (!allowed.includes(file.type)) {
            toast.error('Only PNG, JPG, SVG, or WebP files accepted');
            return;
        }

        // Validate size
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File must be less than 2MB');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('logo', selectedFile);

        try {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    setUploadProgress(Math.round((e.loaded / e.total) * 100));
                }
            };

            const result = await new Promise<any>((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Upload failed'));
                    }
                };
                xhr.onerror = () => reject(new Error('Upload failed'));
                xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/admin/site-settings/logo`);
                const token = localStorage.getItem('token');
                if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.send(formData);
            });

            if (result.success) {
                setLogoUrl(result.data.logoUrl);
                setPreviewUrl(null);
                setSelectedFile(null);
                toast.success('Logo updated successfully');
            }
        } catch {
            toast.error('Failed to upload logo');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleReset = async () => {
        try {
            await api.delete('/admin/site-settings/logo');
            setLogoUrl(null);
            setPreviewUrl(null);
            setSelectedFile(null);
            toast.success('Logo reset to default');
        } catch {
            toast.error('Failed to reset logo');
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
        <div className="max-w-2xl mx-auto space-y-8 font-sans fade-in-up">
            <div className="border-b border-[#E8E3DD] pb-6">
                <h1 className="text-2xl md:text-3xl font-serif text-[#2A2626]">Logo Manager</h1>
                <p className="text-[14px] text-[#6B6363] mt-2 font-light">
                    Upload and manage your site logo.
                </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-lg border border-[#E8E3DD] shadow-sm space-y-6">
                {/* Current Logo Preview */}
                <div>
                    <label className="text-[11px] font-semibold text-[#6B6363] mb-3 block uppercase tracking-wider">
                        Current Logo
                    </label>
                    <div className="w-full max-w-[200px] h-[80px] bg-white border border-[#E8E3DD] rounded-lg flex items-center justify-center p-3">
                        {previewUrl || logoUrl ? (
                            <img
                                src={previewUrl || logoUrl || ''}
                                alt="Logo Preview"
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <span className="text-xl font-serif text-[#8B1A1A]">Anjaraipetti</span>
                        )}
                    </div>
                    {previewUrl && (
                        <p className="text-[12px] text-[#C8962E] mt-2 font-medium">
                            ↑ Preview — Click &quot;Save Logo&quot; to apply
                        </p>
                    )}
                </div>

                {/* Upload Button */}
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.webp"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-3 px-6 py-3 bg-[#FAF8F5] border border-[#E8E3DD] rounded text-[13px] font-medium text-[#2A2626] hover:border-[#8B1A1A] transition-colors min-h-[44px]"
                    >
                        <Upload className="w-5 h-5" strokeWidth={1.5} />
                        Upload New Logo
                    </button>
                    <p className="text-[11px] text-[#6B6363] mt-2">
                        Recommended: PNG with transparent background, 200x60px minimum, max 2MB
                    </p>
                </div>

                {/* Upload Progress */}
                {uploading && (
                    <div className="upload-progress">
                        <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E8E3DD]">
                    <button
                        onClick={handleSave}
                        disabled={!selectedFile || uploading}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-[#218F5B] text-white text-[13px] font-medium uppercase tracking-wider rounded hover:bg-[#1a7048] disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
                    >
                        {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {uploading ? 'Uploading...' : 'Save Logo'}
                    </button>

                    {logoUrl && (
                        <button
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-medium text-[#6B6363] hover:text-[#8B1A1A] transition-colors min-h-[44px]"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset to Default
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
