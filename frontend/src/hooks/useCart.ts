import { useCartStore } from '@/store/cartStore';

export const useCart = () => {
    const store = useCartStore();
    return {
        items: store.items,
        addItem: store.addItem,
        removeItem: store.removeItem,
        updateQuantity: store.updateQuantity,
        clearCart: store.clearCart,
        subtotal: store.getSubtotal(),
        deliveryCharge: store.getDeliveryCharge(),
        total: store.getTotal(),
        itemCount: store.getItemCount(),
    };
};
