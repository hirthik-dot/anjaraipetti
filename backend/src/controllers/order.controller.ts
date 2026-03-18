import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';
import crypto from 'crypto';

// Generate unique order number
const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `APM-${timestamp}-${random}`;
};

// POST /api/orders — Create order
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { items, address, paymentMode, notes, name, email } = req.body;
    const userId = req.user!.id;

    // Update user name/email if provided
    if (name || email) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
            },
        });
    }

    // Save address
    const savedAddress = await prisma.address.create({
        data: {
            userId,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            isDefault: true,
        },
    });

    // Fetch all products and calculate server-side totals (NEVER trust frontend)
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== items.length) {
        res.status(400).json({
            success: false,
            message: 'Some products are unavailable',
            code: 'PRODUCTS_UNAVAILABLE',
        });
        return;
    }

    // Check stock and calculate
    let subtotal = 0;
    const orderItems = items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId)!;

        if (product.stock < item.quantity) {
            throw Object.assign(new Error(`${product.name} is out of stock`), {
                statusCode: 400,
                code: 'OUT_OF_STOCK',
                isOperational: true,
            });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        return {
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
            name: product.name,
        };
    });

    // Delivery charge: free above ₹499
    const deliveryCharge = subtotal >= 499 ? 0 : 50;
    const total = subtotal + deliveryCharge;

    // Create order
    const order = await prisma.order.create({
        data: {
            orderNumber: generateOrderNumber(),
            userId,
            subtotal,
            deliveryCharge,
            total,
            paymentMode,
            paymentStatus: paymentMode === 'COD' ? 'PENDING' : 'PENDING',
            orderStatus: 'PLACED',
            address: {
                line1: savedAddress.line1,
                line2: savedAddress.line2,
                city: savedAddress.city,
                state: savedAddress.state,
                pincode: savedAddress.pincode,
            },
            notes,
            items: {
                create: orderItems,
            },
        },
        include: {
            items: { include: { product: true } },
            user: true,
        },
    });

    // Update stock
    for (const item of items) {
        await prisma.product.update({
            where: { id: item.productId },
            data: {
                stock: { decrement: item.quantity },
            },
        });
    }

    res.status(201).json({
        success: true,
        data: { order },
    });
});

// GET /api/orders/my — User's order history
export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await prisma.order.findMany({
        where: { userId: req.user!.id },
        include: {
            items: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        success: true,
        data: { orders },
    });
});

// GET /api/orders/:id — Single order detail
export const getOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await prisma.order.findFirst({
        where: {
            id: req.params.id,
            userId: req.user!.id,
        },
        include: {
            items: { include: { product: true } },
            user: true,
        },
    });

    if (!order) {
        res.status(404).json({
            success: false,
            message: 'Order not found',
            code: 'ORDER_NOT_FOUND',
        });
        return;
    }

    res.json({
        success: true,
        data: { order },
    });
});
