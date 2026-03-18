import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler.middleware';
import { createAuditLog } from '../services/audit.service';

// GET /api/admin/dashboard — Stats + recent orders
export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        recentOrders,
        ordersByStatus,
        todayOrders,
    ] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.aggregate({
            _sum: { total: true },
            where: { paymentStatus: 'PAID' },
        }),
        prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: true, items: true },
        }),
        prisma.order.groupBy({
            by: ['orderStatus'],
            _count: true,
        }),
        prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        }),
    ]);

    res.json({
        success: true,
        data: {
            stats: {
                totalProducts,
                totalOrders,
                totalCustomers,
                totalRevenue: totalRevenue._sum.total || 0,
                todayOrders,
            },
            ordersByStatus,
            recentOrders,
        },
    });
});

// GET /api/admin/products — All products
export const getAdminProducts = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        success: true,
        data: { products },
    });
});

// POST /api/admin/products — Create product
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await prisma.product.create({
        data: req.body,
        include: { category: true },
    });

    await createAuditLog(
        req.admin!.id,
        'CREATE',
        'Product',
        product.id,
        { name: product.name, price: product.price }
    );

    res.status(201).json({
        success: true,
        data: { product },
    });
});

// PUT /api/admin/products/:id — Update product
export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const existing = await prisma.product.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        res.status(404).json({
            success: false,
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND',
        });
        return;
    }

    const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body,
        include: { category: true },
    });

    await createAuditLog(
        req.admin!.id,
        'UPDATE',
        'Product',
        product.id,
        { changes: req.body }
    );

    res.json({
        success: true,
        data: { product },
    });
});

// DELETE /api/admin/products/:id — Delete product
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const existing = await prisma.product.findUnique({
        where: { id: req.params.id },
    });

    if (!existing) {
        res.status(404).json({
            success: false,
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND',
        });
        return;
    }

    await prisma.product.update({
        where: { id: req.params.id },
        data: { isActive: false },
    });

    await createAuditLog(
        req.admin!.id,
        'DELETE',
        'Product',
        req.params.id,
        { name: existing.name }
    );

    res.json({
        success: true,
        message: 'Product deactivated successfully',
    });
});

// GET /api/admin/orders — All orders with filters
export const getAdminOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (status) where.orderStatus = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                user: true,
                items: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
        }),
        prisma.order.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            orders,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        },
    });
});

// GET /api/admin/orders/:id — Order detail
export const getAdminOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
            user: true,
            items: { include: { product: true } },
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

// PUT /api/admin/orders/:id/status — Update order status
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { orderStatus } = req.body;

    const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { orderStatus },
        include: {
            user: true,
            items: { include: { product: true } },
        },
    });

    await createAuditLog(
        req.admin!.id,
        'UPDATE_STATUS',
        'Order',
        order.id,
        { newStatus: orderStatus, orderNumber: order.orderNumber }
    );

    res.json({
        success: true,
        data: { order },
    });
});

// GET /api/admin/customers — All customers
export const getCustomers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
        prisma.user.findMany({
            include: {
                _count: { select: { orders: true } },
                orders: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: { createdAt: true, total: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
        }),
        prisma.user.count(),
    ]);

    res.json({
        success: true,
        data: {
            customers,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        },
    });
});

// GET /api/admin/audit-logs — Audit trail
export const getAuditLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            include: { admin: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum,
        }),
        prisma.auditLog.count(),
    ]);

    res.json({
        success: true,
        data: {
            logs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        },
    });
});
