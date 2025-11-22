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
    } catch {}

    return res.json({ sent: messages.length, expoResponse });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
});

export default router;
