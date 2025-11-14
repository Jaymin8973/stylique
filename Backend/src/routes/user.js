import { Router } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

router.get('/:id', async (req, res) =>{ 
  try {
      const UserID = Number(req.params.id);
    const user = await prisma.users.findFirst({
      where: {UserID},
    });
    if (!user) return res.status(404).json({ error: 'Product not found' });
    res.json(user);
  } catch (e) { 
    console.error(e.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;