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
    const isActive = user.IsActive == null ? true : Number(user.IsActive) === 1;
    if (!isActive) {
      return res.status(403).json({ error: 'Your account is inactive. Please contact support.' });
    }

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

router.post('/register', async (req, res) => {
  try {
    const { name, firstname, lastname, email, password } = req.body || {};

    if (!email || !password || !(name || firstname)) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = await prisma.users.findFirst({ where: { Email: email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const fullName = name || `${firstname || ''} ${lastname || ''}`.trim();
    const usernameSource = fullName || email;
    const username = usernameSource.split(' ')[0] || email;

    let roleId = 1;
    try {
      const role = await prisma.roles.findFirst({ where: { RoleName: 'user' } });
      if (role) roleId = role.RoleID;
    } catch {}

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        Username: username,
        Email: email,
        PasswordHash: hash,
        RoleID: roleId,
        IsActive: true,
      },
    });

    const payload = { id: Number(user.UserID), roleId: Number(user.RoleID) };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: { id: payload.id, email: user.Email, roleId: payload.roleId },
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
