import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';
import {
    createRazorpayOrder,
    verifyRazorpaySignature,
    verifyWebhookSignature,
} from '../services/razorpay.service';

// POST /api/payment/create-order
export const createPaymentOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { orderId } = (req as any).body;

    const order = await prisma.order.findFirst({
        where: { id: orderId, userId: (req as any).user!.id },
    });

    if (!order) {
        res.status(404).json({
            success: false,
            message: 'Order not found',
            code: 'ORDER_NOT_FOUND',
        });
        return;
    }

    // Recalculate total from DB (never trust frontend amount)
    const razorpayOrder = await createRazorpayOrder(order.total, order.orderNumber);

    // Save Razorpay order ID
    await prisma.order.update({
        where: { id: orderId },
        data: { razorpayOrderId: razorpayOrder.id },
    });

    res.json({
        success: true,
        data: {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        },
    });
});

// POST /api/payment/verify
export const verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = (req as any).body;

    // Verify signature
    const isValid = verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
    );

    if (!isValid) {
        res.status(400).json({
            success: false,
            message: 'Payment verification failed',
            code: 'PAYMENT_VERIFICATION_FAILED',
        });
        return;
    }

    // Update order
    const order = await prisma.order.update({
        where: { razorpayOrderId },
        data: {
            paymentStatus: 'PAID',
            razorpayPaymentId,
            razorpaySignature,
        },
        include: {
            items: { include: { product: true } },
        },
    });

    res.json({
        success: true,
        data: { order },
    });
});

// POST /api/payment/webhook (raw body, no auth)
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!signature) {
        res.status(400).json({
            success: false,
            message: 'Missing signature',
            code: 'MISSING_SIGNATURE',
        });
        return;
    }

    // Verify webhook signature with raw body
    const rawBody = (req as any).rawBody || JSON.stringify((req as any).body);
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
        res.status(400).json({
            success: false,
            message: 'Invalid webhook signature',
            code: 'INVALID_WEBHOOK_SIGNATURE',
        });
        return;
    }

    const event = (req as any).body;

    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        await prisma.order.updateMany({
            where: { razorpayOrderId },
            data: {
                paymentStatus: 'PAID',
                razorpayPaymentId: payment.id,
            },
        });
    }

    if (event.event === 'payment.failed') {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        await prisma.order.updateMany({
            where: { razorpayOrderId },
            data: { paymentStatus: 'FAILED' },
        });
    }

    res.json({ success: true });
});
