/**
 * Orders Route - Order management ke saare endpoints
 * Create, read, update status, cancel, return - sab yahan hai
 */

import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';
import { generateInvoicePDF, formatInvoiceData } from '../utils/invoice-generator.js';
import { sendOrderNotificationEmail, sendOrderConfirmationEmail, sendOrderShippedEmail, sendOrderDeliveredEmail } from '../utils/email-service.js';
// Order state machine service import
import orderService from '../services/orderService.js';

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

    // Fetch complete order with user details for notification
    const fullOrder = await prisma.orders.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        user: true,
      },
    });

    // Send email notification to seller (async, don't block response)
    sendOrderNotificationEmail(fullOrder).catch((err) => {
      console.error('Failed to send order notification email:', err.message);
    });

    // Send confirmation email to customer
    sendOrderConfirmationEmail(fullOrder).catch((err) => {
      console.error('Failed to send customer confirmation email:', err.message);
    });

    // Create seller dashboard notification
    const itemNames = order.items.map(i => i.productName).join(', ');
    await prisma.sellernotification.create({
      data: {
        type: 'new_order',
        title: `New Order #${order.orderNumber || order.id}`,
        message: `New order received from ${fullOrder?.user?.Username || 'Customer'}. Items: ${itemNames}. Total: ₹${parseFloat(order.total || 0).toFixed(2)}`,
        orderId: order.id,
      },
    }).catch((err) => {
      console.error('Failed to create seller notification:', err.message);
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
        tracking: {
          orderBy: { eventAt: 'desc' }
        }
      },
    });

    const mapped = orders.map((o) => {
      const firstItem = o.items[0];
      const totalAmount = Number.parseFloat(o.total || '0') || 0;
      const qty = o.items.reduce((sum, it) => sum + (it.quantity || 0), 0);

      // Extract return reason from tracking if available
      const returnEvent = o.tracking.find(t => t.status.startsWith('Return requested'));
      const returnReason = returnEvent ? returnEvent.status.replace('Return requested: ', '') : undefined;

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
        return_reason: returnReason,
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

// Admin: Get invoice data for any order (sellers)
router.get('/admin/:id/invoice', async (req, res) => {
  try {
    // Only allow seller/admin roles
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid order id' });

    const order = await prisma.orders.findUnique({
      where: { id },
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

// Admin: Generate and download invoice PDF for any order (sellers)
router.get('/admin/:id/invoice/pdf', async (req, res) => {
  try {
    // Only allow seller/admin roles
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid order id' });

    const order = await prisma.orders.findUnique({
      where: { id },
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

/**
 * Admin: Update order status
 * State machine se validate karta hai ki transition valid hai ya nahi
 */
router.patch('/:id/status', async (req, res) => {
  try {
    // Seller/admin role check
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden - Seller access required' });
    }

    const id = Number(req.params.id);
    const { status } = req.body;

    if (!id) return res.status(400).json({ error: 'Invalid order id' });
    if (!status) return res.status(400).json({ error: 'Status is required' });

    // Order fetch karo
    const order = await prisma.orders.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // State machine se validate karo
    if (!orderService.isValidTransition(order.status, status)) {
      const possibleStatuses = orderService.getNextPossibleStatuses(order.status);
      return res.status(400).json({
        error: `Invalid status transition from '${order.status}' to '${status}'`,
        allowedStatuses: possibleStatuses
      });
    }

    // Status update karo
    const updated = await prisma.orders.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { items: true, user: true }
    });

    // Tracking event create karo
    const displayText = orderService.getStatusDisplayText(status);
    await prisma.ordertracking.create({
      data: {
        orderId: id,
        status: displayText,
        eventAt: new Date()
      }
    });

    // Send email notifications based on status
    if (status === 'shipped') {
      sendOrderShippedEmail(updated).catch(console.error);
    } else if (status === 'delivered') {
      sendOrderDeliveredEmail(updated).catch(console.error);
    }

    return res.json({
      ...updated,
      statusDisplay: displayText,
      statusColor: orderService.getStatusColor(status),
      nextPossibleStatuses: orderService.getNextPossibleStatuses(status)
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

/**
 * Customer: Cancel order
 * Sirf pending, confirmed, processing orders cancel ho sakte hain
 */
router.post('/:id/cancel', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { reason } = req.body || {};

    if (!id) return res.status(400).json({ error: 'Invalid order id' });

    // User ka order hi cancel ho sakta hai
    const order = await prisma.orders.findFirst({ where: { id, userId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Check karo cancel ho sakta hai ya nahi
    if (!orderService.canCancelOrder(order.status)) {
      return res.status(400).json({
        error: `Order cannot be cancelled. Current status: ${order.status}`,
        message: 'Orders can only be cancelled before shipping'
      });
    }

    // Cancel karo
    const updated = await prisma.orders.update({
      where: { id },
      data: { status: orderService.ORDER_STATUSES.CANCELLED, updatedAt: new Date() },
      include: { items: true }
    });

    // Tracking event
    await prisma.ordertracking.create({
      data: {
        orderId: id,
        status: `Order cancelled${reason ? `: ${reason}` : ''}`,
        eventAt: new Date()
      }
    });

    // Seller notification
    await prisma.sellernotification.create({
      data: {
        type: 'order_cancelled',
        title: `Order #${order.orderNumber} Cancelled`,
        message: `Customer cancelled order. ${reason ? `Reason: ${reason}` : ''}`,
        orderId: id,
      }
    }).catch(console.error);

    return res.json({
      message: 'Order cancelled successfully',
      order: updated
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to cancel order' });
  }
});

/**
 * Customer: Request return
 * Sirf delivered orders pe return request ho sakti hai
 */
router.post('/:id/return', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { reason, description } = req.body || {};

    if (!id) return res.status(400).json({ error: 'Invalid order id' });
    if (!reason) return res.status(400).json({ error: 'Return reason is required' });

    // User ka order check karo
    const order = await prisma.orders.findFirst({ where: { id, userId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Check karo return ho sakti hai ya nahi
    if (!orderService.canRequestReturn(order.status)) {
      return res.status(400).json({
        error: `Return cannot be requested. Current status: ${order.status}`,
        message: 'Returns can only be requested for delivered orders'
      });
    }

    // Return status pe update karo
    const updated = await prisma.orders.update({
      where: { id },
      data: { status: orderService.ORDER_STATUSES.RETURN_REQUESTED, updatedAt: new Date() },
      include: { items: true }
    });

    // Tracking event
    await prisma.ordertracking.create({
      data: {
        orderId: id,
        status: `Return requested: ${reason}`,
        eventAt: new Date()
      }
    });

    // Seller notification
    await prisma.sellernotification.create({
      data: {
        type: 'return_requested',
        title: `Return Request - Order #${order.orderNumber}`,
        message: `Customer requested return. Reason: ${reason}. ${description || ''}`,
        orderId: id,
      }
    }).catch(console.error);

    return res.json({
      message: 'Return request submitted successfully',
      order: updated
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to submit return request' });
  }
});

/**
 * Get possible statuses for an order
 * Frontend ko batata hai next kya-kya statuses possible hain
 */
router.get('/:id/possible-statuses', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid order id' });

    const order = await prisma.orders.findUnique({ where: { id }, select: { status: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    return res.json({
      currentStatus: order.status,
      currentStatusDisplay: orderService.getStatusDisplayText(order.status),
      currentStatusColor: orderService.getStatusColor(order.status),
      possibleStatuses: orderService.getNextPossibleStatuses(order.status),
      canCancel: orderService.canCancelOrder(order.status),
      canRequestReturn: orderService.canRequestReturn(order.status),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to get status info' });
  }
});

export default router;
