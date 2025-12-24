import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';
import { generateInvoicePDF, formatInvoiceData } from '../utils/invoice-generator.js';

const router = Router();

router.use(authAny);

// Create an order from the current user's cart and default address
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipping } = req.body || {};

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Pick default address
    let addr = await prisma.address.findFirst({ where: { userId, isDefault: true } });
    if (!addr) {
      addr = await prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    if (!addr) return res.status(400).json({ error: 'No address found for user' });

    const subtotalNum = cart.items.reduce((sum, it) => sum + parseFloat(it.unitPrice || '0') * it.quantity, 0);
    const shippingNum = Number(shipping ?? 0);
    const totalNum = subtotalNum + (Number.isFinite(shippingNum) ? shippingNum : 0);

    const subtotal = subtotalNum.toFixed(2);
    const shippingStr = (Number.isFinite(shippingNum) ? shippingNum : 0).toFixed(2);
    const total = totalNum.toFixed(2);

    const addressText = `${addr.houseNo}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`;

    const orderNumber = `ORD${Date.now()}`;
    const trackingNumber = `TRK${Math.floor(Math.random() * 1e8)}`;

    const itemsData = cart.items.map((ci) => ({
      productId: ci.productId,
      productName: ci.product?.productName || 'Product',
      quantity: ci.quantity,
      unitPrice: ci.unitPrice,
    }));

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.orders.create({
        data: {
          userId,
          orderNumber,
          status: 'processing',
          trackingNumber,
          subtotal,
          shipping: shippingStr,
          total,
          addressText,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Seed first tracking event
      await tx.ordertracking.create({
        data: {
          orderId: created.id,
          status: 'Sender is preparing to ship your order',
          eventAt: new Date(),
        },
      });

      // Clear cart items
      await tx.cartitem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return res.status(201).json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

// List orders for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query || {};

    const where = { userId };
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await prisma.orders.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
        _count: {
          select: { items: true },
        },
      },
    });

    return res.json(orders);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: list all orders with customer and basic product info
router.get('/admin', async (req, res) => {
  try {
    // Only allow seller/admin roles (RoleID 2 assumed to be seller)
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const orders = await prisma.orders.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const mapped = orders.map((o) => {
      const firstItem = o.items[0];
      const totalAmount = Number.parseFloat(o.total || '0') || 0;
      const qty = o.items.reduce((sum, it) => sum + (it.quantity || 0), 0);

      return {
        id: o.id,
        customer_name: o.user?.Username || `User #${o.userId}`,
        customer_email: o.user?.Email || '',
        product_id: firstItem?.productId || 0,
        product_name:
          firstItem?.productName || firstItem?.product?.productName || undefined,
        quantity: qty,
        total_amount: totalAmount,
        status: o.status || 'processing',
        shipping_address: o.addressText || '',
        created_at: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
        updated_at: o.updatedAt ? o.updatedAt.toISOString() : new Date().toISOString(),
      };
    });

    return res.json(mapped);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

// Get an order with items for current user
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid order id' });

    const order = await prisma.orders.findFirst({
      where: { id, userId },
      include: { items: true, tracking: { orderBy: { eventAt: 'desc' } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Fetch order by tracking number (with items and tracking)
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const userId = req.user.id;
    const trackingNumber = String(req.params.trackingNumber);
    if (!trackingNumber) return res.status(400).json({ error: 'Invalid tracking number' });

    const order = await prisma.orders.findFirst({
      where: { trackingNumber, userId },
      include: { items: true, tracking: { orderBy: { eventAt: 'desc' } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch tracking info' });
  }
});

// Get tracking timeline for an order id
router.get('/:id/tracking', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid order id' });

    const order = await prisma.orders.findFirst({ where: { id, userId }, select: { id: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const events = await prisma.ordertracking.findMany({ where: { orderId: id }, orderBy: { eventAt: 'desc' } });
    return res.json(events);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch tracking events' });
  }
});

// Append a tracking event (admin or system). For now, allow authenticated user to simulate.
router.post('/:id/tracking', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { status, eventAt } = req.body || {};
    if (!id) return res.status(400).json({ error: 'Invalid order id' });
    if (!status) return res.status(400).json({ error: 'status is required' });

    const order = await prisma.orders.findFirst({ where: { id, userId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const created = await prisma.ordertracking.create({
      data: { orderId: id, status, eventAt: eventAt ? new Date(eventAt) : new Date() },
    });

    return res.status(201).json(created);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to add tracking event' });
  }
});

// Get invoice data as JSON
router.get('/:id/invoice', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid order id' });

    const order = await prisma.orders.findFirst({
      where: { id, userId },
      include: {
        items: true,
        user: true,
      },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const invoiceData = formatInvoiceData(order);
    return res.json(invoiceData);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to generate invoice data' });
  }
});

// Generate and download invoice PDF
router.get('/:id/invoice/pdf', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid order id' });

    const order = await prisma.orders.findFirst({
      where: { id, userId },
      include: {
        items: true,
        user: true,
      },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const pdfBuffer = await generateInvoicePDF(order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber || order.id}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to generate invoice PDF' });
  }
});

// Admin: Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    // Only allow seller/admin roles
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const id = Number(req.params.id);
    const { status } = req.body;

    if (!id) return res.status(400).json({ error: 'Invalid order id' });
    if (!status) return res.status(400).json({ error: 'Status is required' });

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const order = await prisma.orders.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Update order status
    const updated = await prisma.orders.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        items: true,
        user: true
      }
    });

    // Create tracking event for status change
    const statusMessages = {
      pending: 'Order placed and awaiting confirmation',
      processing: 'Order is being processed',
      shipped: 'Order has been shipped',
      delivered: 'Order has been delivered',
      cancelled: 'Order has been cancelled'
    };

    await prisma.ordertracking.create({
      data: {
        orderId: id,
        status: statusMessages[status] || `Status updated to ${status}`,
        eventAt: new Date()
      }
    });

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
