import { Router } from 'express';
import authAny from '../middleware/authAny.js';
import shippingService from '../services/shippingService.js';

const router = Router();
router.use(authAny);

/**
 * Ship Order (Manual)
 * Updates order status to 'shipped' and adds tracking info
 */
router.post('/:id/ship', async (req, res) => {
    try {
        // Only seller/admin (RoleID 2 assumed seller based on previous code)
        if (Number(req.user.roleId) !== 2) {
            return res.status(403).json({ error: 'Forbidden - Seller access required' });
        }

        const id = Number(req.params.id);
        const { courier, trackingNumber } = req.body;

        if (!id) return res.status(400).json({ error: 'Invalid order id' });

        const result = await shippingService.shipOrder(id, courier, trackingNumber);
        return res.json(result);
    } catch (e) {
        console.error('Shipping error:', e);
        return res.status(400).json({ error: e.message || 'Failed to ship order' });
    }
});

/**
 * Add Manual Tracking Update
 * Adds a new event to order history
 */
router.post('/:id/track', async (req, res) => {
    try {
        // Only seller/admin
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

export default router;
