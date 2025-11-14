import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';

const router = Router();

router.use(authAny);

// Get wishlist for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ error: 'Invalid userId' });

    const list = await prisma.wishlist.findMany({
      where: { userId },
      select: {
        id: true,
        productId: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            productName: true,
            imageUrl: true,
            sellingPrice: true,
            brand: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Check if product is in user's wishlist
router.get('/check/:userId/:productId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const productId = Number(req.params.productId);
    if (!userId || !productId) return res.status(400).json({ error: 'Invalid params' });

    const found = await prisma.wishlist.findFirst({ where: { userId, productId } });
    res.json({ isInWishlist: !!found });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to check wishlist' });
  }
});

// Add to wishlist
router.post('/add', async (req, res) => {
  try {
    const userId = Number(req.body?.user_id || req.user?.id);
    const productId = Number(req.body?.productId);
    if (!userId || !productId) return res.status(400).json({ error: 'user_id and productId are required' });

    // ensure product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const item = await prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    });

    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to add wishlist' });
  }
});

// Remove from wishlist
router.post('/remove', async (req, res) => {
  try {
    const userId = Number(req.body?.user_id || req.user?.id);
    const productId = Number(req.body?.productId);
    if (!userId || !productId) return res.status(400).json({ error: 'user_id and productId are required' });

    await prisma.wishlist.deleteMany({ where: { userId, productId } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to remove wishlist' });
  }
});

export default router;
