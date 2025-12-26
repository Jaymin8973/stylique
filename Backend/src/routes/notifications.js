import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/register', authAny, async (req, res) => {
  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const userId = Number(req.user.id);
    await prisma.users.update({
      where: { UserID: userId },
      data: { PushToken: token },
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to register push token' });
  }
});

router.post('/broadcast', auth, async (req, res) => {
  try {
    const { title, body, data } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const users = await prisma.users.findMany({
      where: { IsActive: true, PushToken: { not: null } },
      select: { PushToken: true },
    });

    const tokens = users.map((u) => u.PushToken).filter(Boolean);
    if (!tokens.length) {
      return res.json({ sent: 0 });
    }

    const messages = tokens.map((to) => ({
      to,
      sound: 'default',
      title,
      body,
      data: data || {},
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    let expoResponse = null;
    try {
      expoResponse = await response.json();
    } catch { }

    return res.json({ sent: messages.length, expoResponse });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
});

// ==================== SELLER NOTIFICATIONS ====================

// Get all seller notifications
router.get('/seller', auth, async (req, res) => {
  try {
    // Only allow seller/admin roles
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const notifications = await prisma.sellernotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50
    });

    return res.json(notifications);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count for badge
router.get('/seller/unread-count', auth, async (req, res) => {
  try {
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const count = await prisma.sellernotification.count({
      where: { isRead: false },
    });

    return res.json({ count });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark single notification as read
router.patch('/seller/:id/read', auth, async (req, res) => {
  try {
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid notification id' });

    const updated = await prisma.sellernotification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json(updated);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.patch('/seller/read-all', auth, async (req, res) => {
  try {
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.sellernotification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// Delete all notifications (clear all)
router.delete('/seller/clear-all', auth, async (req, res) => {
  try {
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.sellernotification.deleteMany({});

    return res.json({ ok: true, message: 'All notifications cleared' });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

export default router;
