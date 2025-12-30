import prisma from '../prismaClient.js';
import { sendOrderShippedEmail } from '../utils/email-service.js';

/**
 * Shipping Service
 * Handles manual shipping operations and tracking updates
 */
class ShippingService {
    /**
     * Manually ship an order
     * Sets courier, tracking number and updates status to 'shipped'
     * @param {number} orderId
     * @param {string} courier
     * @param {string} trackingNumber
     */
    async shipOrder(orderId, courier, trackingNumber) {
        // 1. Validate inputs
        if (!orderId || !courier || !trackingNumber) {
            throw new Error('Missing required shipping details');
        }

        // 2. Get current order
        const order = await prisma.orders.findUnique({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');

        // 3. Validate status transition
        // Can ship from 'confirmed' or 'processing'
        const allowedStatuses = ['confirmed', 'processing'];
        if (!allowedStatuses.includes(order.status)) {
            throw new Error(`Order cannot be shipped from status: ${order.status}. Must be confirmed or processing.`);
        }

        // 4. Update order
        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: {
                status: 'shipped',
                courier: courier,
                trackingNumber: trackingNumber,
                updatedAt: new Date()
            },
            include: {
                items: true,
                user: true
            }
        });

        // 5. Add tracking event
        await prisma.ordertracking.create({
            data: {
                orderId: orderId,
                status: `Shipped via ${courier}. Tracking ID: ${trackingNumber}`,
                eventAt: new Date()
            }
        });

        // 6. Send email notification (async)
        sendOrderShippedEmail(updatedOrder).catch(err =>
            console.error('Failed to send shipped email:', err.message)
        );

        return updatedOrder;
    }

    /**
     * Update tracking status manually
     * @param {number} orderId 
     * @param {string} status 
     * @param {string} location 
     */
    async addTrackingUpdate(orderId, status, location) {
        const order = await prisma.orders.findUnique({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');

        const updateText = location ? `${status} at ${location}` : status;

        return await prisma.ordertracking.create({
            data: {
                orderId,
                status: updateText,
                eventAt: new Date()
            }
        });
    }
}

export default new ShippingService();
