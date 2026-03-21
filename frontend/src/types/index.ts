export interface Product {
    id: string;
    name: string;
    nameTa: string;
    description: string;
    descTa: string;
    price: number;
    mrp: number;
    stock: number;
    images: string[];
    categoryId: string;
    category?: Category;
    isActive: boolean;
    isFeatured: boolean;
    weight: string;
    makingVideoUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CarouselSlide {
    id: string;
    imageUrl: string;
    headline?: string;
    subtext?: string;
    ctaText: string;
    ctaLink: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
}

export interface SiteSettings {
    id: number;
    logoUrl?: string | null;
    tickerMessages: string[];
    tickerEnabled: boolean;
    tickerSpeed: 'slow' | 'normal' | 'fast';
}


export interface Category {
    id: string;
    name: string;
    nameTa: string;
    slug: string;
    image: string;
    _count?: {
        products: number;
    };
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface User {
    id: string;
    name: string;
    phone: string;
    email?: string;
    addresses: Address[];
}

export interface Address {
    id?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    user?: User;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    total: number;
    paymentMode: 'RAZORPAY' | 'COD';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    orderStatus: 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    address: Address;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    product?: Product;
    quantity: number;
    price: number;
    name: string;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
}

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    todayOrders: number;
}

export interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    adminId: string;
    admin?: { name: string; email: string };
    details: Record<string, unknown>;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    code?: string;
    errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
