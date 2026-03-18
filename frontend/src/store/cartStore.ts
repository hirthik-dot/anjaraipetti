import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getSubtotal: () => number;
    getDeliveryCharge: () => number;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product: Product, quantity = 1) => {
                set((state) => {
                    const existing = state.items.find((item) => item.product.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { product, quantity }] };
                });
            },

            removeItem: (productId: string) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }));
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            getSubtotal: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );
            },

            getDeliveryCharge: () => {
                const subtotal = get().getSubtotal();
                return subtotal >= 499 ? 0 : 50;
            },

            getTotal: () => {
                return get().getSubtotal() + get().getDeliveryCharge();
            },

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },
        }),
        {
            name: 'anjaraipetti-cart',
        }
    )
);
