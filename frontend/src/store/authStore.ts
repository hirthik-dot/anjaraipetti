import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User, token: string) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
    sendOTP: (phone: string) => Promise<void>;
    verifyOTP: (phone: string, otp: string) => Promise<void>;
    resendOTP: (phone: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user: User, token: string) => {
                localStorage.setItem('token', token);
                set({ user, token, isAuthenticated: true });
            },

            sendOTP: async (phone: string) => {
                const res = await api.post('/auth/send-otp', { phone });
                if (res.status >= 400 || res.data?.message?.includes('Failed')) {
                    throw new Error(res.data?.message || 'Failed to send OTP');
                }
            },

            verifyOTP: async (phone: string, otp: string) => {
                const res = await api.post('/auth/verify-otp', { phone, otp });
                if (res.status >= 400 || !res.data?.token) {
                    throw new Error(res.data?.message || 'Failed to verify OTP');
                }
                const data = res.data;
                localStorage.setItem('token', data.token);
                set({ user: data.user, token: data.token, isAuthenticated: true });
            },

            resendOTP: async (phone: string) => {
                const res = await api.post('/auth/resend-otp', { phone });
                if (res.status >= 400 || res.data?.message?.includes('Failed')) {
                    throw new Error(res.data?.message || 'Failed to resend OTP');
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                api.post('/auth/logout').catch(() => { });
                set({ user: null, token: null, isAuthenticated: false });
            },

            fetchUser: async () => {
                try {
                    set({ isLoading: true });
                    const token = get().token || localStorage.getItem('token');
                    if (!token) {
                        set({ isLoading: false });
                        return;
                    }
                    const res = await api.get('/auth/me');
                    if (res.data.success && res.data.data.user) {
                        set({
                            user: res.data.data.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    } else {
                        set({ isLoading: false });
                    }
                } catch {
                    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                    localStorage.removeItem('token');
                }
            },
        }),
        {
            name: 'anjaraipetti-auth',
            partialize: (state) => ({ token: state.token }),
        }
    )
);
