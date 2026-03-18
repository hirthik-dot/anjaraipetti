'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Clean up inputs just in case of trailing spaces
            const cleanEmail = email.trim().toLowerCase();
            const cleanPassword = password.trim();

            const res = await api.post('/auth/admin/login', { 
                email: cleanEmail, 
                password: cleanPassword 
            });
            
            if (res.data.success) {
                localStorage.setItem('token', res.data.data.token);
                toast.success('Welcome back, Admin!');
                router.push('/admin/dashboard');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || (error.message === 'Network Error' ? 'Backend is offline (Network Error)' : 'Invalid credentials');
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 font-sans">
            
            {/* Elegant Header */}
            <div className="text-center mb-10 fade-in-up">
                <div className="w-14 h-14 rounded-full border border-[#E8E3DD] bg-white flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <ChefHat className="w-6 h-6 text-[#8B1A1A]" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-serif text-[#2A2626] mb-2">Anjaraipetti</h1>
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6B6363]">Admin Portal</p>
            </div>

            {/* Minimalist Form Card */}
            <div className="w-full max-w-sm fade-in-up delay-1">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-[#E8E3DD] shadow-2xl shadow-[#2A2626]/5" id="admin-login-form">
                    <h2 className="text-[18px] font-serif font-medium text-[#2A2626] text-center mb-8">
                        Sign in to your account
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[12px] font-medium text-[#6B6363] mb-2 block uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#FAF8F5] rounded-[4px] border border-[#E8E3DD] focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all text-[14px] text-[#2A2626]"
                                placeholder="admin@anjaraipetti.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[12px] font-medium text-[#6B6363] mb-2 block uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#FAF8F5] pr-12 rounded-[4px] border border-[#E8E3DD] focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all text-[14px] text-[#2A2626]"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6363] hover:text-[#2A2626] transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-2 bg-[#8B1A1A] text-white text-[13px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#661010] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
                            id="admin-login-btn"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isLoading ? 'Authenticating...' : 'Secure Sign In'}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#E8E3DD]">
                        <p className="text-[11px] text-center text-[#6B6363] leading-relaxed">
                            For authorized personnel only. <br/>
                            <span className="font-mono mt-1 block">admin@anjaraipetti.com / Admin@123</span>
                        </p>
                    </div>
                </form>
            </div>
            
        </div>
    );
}
