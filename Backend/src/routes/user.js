import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';

const router = Router();

// List all users (seller/admin only)
router.get('/', authAny, async (req, res) => {
  try {
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const users = await prisma.users.findMany({
      orderBy: { UserID: 'desc' },
      include: { roles: true },
    });

    const mapped = users.map((u) => ({
      id: u.UserID,
      name: u.Username,
      email: u.Email,
      roleName: u.roles?.RoleName || '',
      isActive: Boolean(u.IsActive ?? true),
      createdAt: u.CreatedAt ?? null,
      updatedAt: u.UpdatedAt ?? null,
    }));

    return res.json(mapped);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Toggle user active status (seller/admin only)
router.patch('/:id/toggle-active', authAny, async (req, res) => {
  try {
    if (Number(req.user.roleId) !== 2) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const UserID = Number(req.params.id);
    const user = await prisma.users.findUnique({ where: { UserID } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updated = await prisma.users.update({
      where: { UserID },
      data: { IsActive: !(user.IsActive ?? true) },
    });

    return res.json({ id: updated.UserID, isActive: Boolean(updated.IsActive ?? true) });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get single user (self or any user if seller/admin)
router.get('/:id', authAny, async (req, res) => { 
  try {
      const UserID = Number(req.params.id);

    if (Number(req.user.roleId) !== 2 && Number(req.user.id) !== UserID) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await prisma.users.findFirst({
      where: {UserID},
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) { 
    console.error(e.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;