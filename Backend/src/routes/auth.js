import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Query existing MySQL users table directly (no Prisma model required)
    const rows = await prisma.$queryRawUnsafe(
      'SELECT UserID AS id, Email, PasswordHash, RoleID, IsActive FROM users WHERE Email = ? LIMIT 1',
      email
    );

    const user = Array.isArray(rows) && rows.length ? rows[0] : null;
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // const valid = await bcrypt.compare(password, user.PasswordHash || '');
    // if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // if (Number(user.RoleID) !== 2) return res.status(403).json({ error: 'Access denied' });
    if (Number(user.IsActive) !== 1) return res.status(403).json({ error: 'Account is inactive' });

    const payload = { id: Number(user.id), roleId: Number(user.RoleID) };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: payload.id, email: user.Email, roleId: payload.roleId },
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
