import { Router } from 'express';
import authAny from '../middleware/authAny.js';
import shippingService from '../services/shippingService.js';
import shiprocketService from '../services/shiprocketService.js';
import prisma from '../prismaClient.js';

const router = Router();

router.post('/:id/ship', authAny, async (req, res) => {
    try {
        if (Number(req.user.roleId) !== 2) {
            return res.status(403).json({ error: 'Forbidden - Seller access required' });
        }

        const id = Number(req.params.id);
        const { courier, trackingNumber, useShiprocket = true } = req.body;

        if (!id) return res.status(400).json({ error: 'Invalid order id' });

        const result = await shippingService.shipOrder(id, courier, trackingNumber, useShiprocket);
        return res.json(result);
    } catch (e) {
        console.error('Shipping error:', e);
        return res.status(400).json({ error: e.message || 'Failed to ship order' });
    }
});

router.post('/:id/ship-manual', authAny, async (req, res) => {
    try {
        if (Number(req.user.roleId) !== 2) {
            return res.status(403).json({ error: 'Forbidden - Seller access required' });
        }

        const id = Number(req.params.id);
        const { courier, trackingNumber } = req.body;

        if (!id) return res.status(400).json({ error: 'Invalid order id' });
        if (!courier || !trackingNumber) {
            return res.status(400).json({ error: 'Courier and tracking number are required' });
        }

        const result = await shippingService.shipOrderManual(id, courier, trackingNumber);
        return res.json(result);
    } catch (e) {
        console.error('Manual shipping error:', e);
        return res.status(400).json({ error: e.message || 'Failed to ship order' });
    }
});

router.post('/:id/track', authAny, async (req, res) => {
    try {
        if (Number(req.user.roleId) !== 2) {
            return res.status(403).json({ error: 'Forbidden - Seller access required' });
        }

        const id = Number(req.params.id);
        const { status, location } = req.body;

        if (!id) return res.status(400).json({ error: 'Invalid order id' });
        if (!status) return res.status(400).json({ error: 'Status is required' });

        const result = await shippingService.addTrackingUpdate(id, status, location);
        return res.json(result);
    } catch (e) {
        console.error('Tracking update error:', e);
        return res.status(500).json({ error: 'Failed to add tracking update' });
    }
});

router.get('/:id/shiprocket-track', authAny, async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ error: 'Invalid order id' });

        const order = await prisma.orders.findUnique({ where: { id } });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (!order.trackingNumber) {
            return res.status(400).json({ error: 'Order has no tracking number' });
        }

        const tracking = await shippingService.getShiprocketTracking(order.trackingNumber);
        if (!tracking) {
            return res.status(404).json({ error: 'Tracking information not available' });
        }

        return res.json(tracking);
    } catch (e) {
        console.error('Shiprocket tracking error:', e);
        return res.status(500).json({ error: 'Failed to fetch tracking' });
    }
});

router.get('/serviceability', authAny, async (req, res) => {
    try {
        const { pickup_pincode, delivery_pincode, weight, cod } = req.query;

        if (!pickup_pincode || !delivery_pincode) {
            return res.status(400).json({ error: 'Pickup and delivery pincodes are required' });
        }

        const couriers = await shiprocketService.checkCourierServiceability(
            pickup_pincode,
            delivery_pincode,
            parseFloat(weight) || 0.5,
            cod === 'true'
        );

        return res.json(couriers);
    } catch (e) {
        console.error('Serviceability check error:', e);
        return res.status(500).json({ error: 'Failed to check courier serviceability' });
    }
});

router.post('/webhook/shiprocket', async (req, res) => {
    try {
        console.log('Shiprocket webhook received:', JSON.stringify(req.body, null, 2));

        const { awb, current_status, current_status_id, shipment_status, etd, scans } = req.body;

        if (!awb) {
            return res.status(400).json({ error: 'AWB code is required' });
        }

        const order = await prisma.orders.findFirst({
            where: { trackingNumber: awb }
        });

        if (!order) {
            console.log('No order found for AWB:', awb);
            return res.status(200).json({ message: 'Order not found, webhook acknowledged' });
        }

        let newStatus = order.status;
        const statusLower = (current_status || '').toLowerCase();

        if (statusLower.includes('delivered')) {
            newStatus = 'delivered';
        } else if (statusLower.includes('out for delivery') || statusLower.includes('ofd')) {
            newStatus = 'out_for_delivery';
        } else if (statusLower.includes('in transit') || statusLower.includes('shipped')) {
            newStatus = 'shipped';
        } else if (statusLower.includes('picked')) {
            newStatus = 'shipped';
        } else if (statusLower.includes('rto') || statusLower.includes('return')) {
            newStatus = 'return_requested';
        } else if (statusLower.includes('cancel')) {
            newStatus = 'cancelled';
        }

        if (newStatus !== order.status) {
            await prisma.orders.update({
                where: { id: order.id },
                data: {
                    status: newStatus,
                    updatedAt: new Date()
                }
            });
        }

        await prisma.ordertracking.create({
            data: {
                orderId: order.id,
                status: current_status || shipment_status || 'Status update',
                eventAt: new Date()
            }
        });

        console.log(`Order ${order.id} updated: ${order.status} -> ${newStatus}`);
        return res.status(200).json({ success: true, message: 'Webhook processed' });

    } catch (e) {
        console.error('Webhook processing error:', e);
        return res.status(200).json({ error: e.message });
    }
});

export default router;
