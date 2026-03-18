import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
    const store = useAuthStore();
    return {
        user: store.user,
        token: store.token,
        isAuthenticated: store.isAuthenticated,
        isLoading: store.isLoading,
        setUser: store.setUser,
        logout: store.logout,
        fetchUser: store.fetchUser,
    };
};
