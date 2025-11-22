import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';

const router = Router();

router.use(authAny);

// Get aggregate rating for a product
router.get('/:productId', async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    if (!productId) return res.status(400).json({ error: 'Invalid product id' });

    const reviews = await prisma.review.findMany({ where: { productId } });
    if (!reviews.length) {
      return res.json({ avgRating: 0, totalCount: 0, ratingPercentages: {} });
    }

    const totalCount = reviews.length;
    let sum = 0;
    const buckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const r of reviews) {
      const val = Number(r.rating) || 0;
      sum += val;
      if (val >= 1 && val <= 5) {
        buckets[val] += 1;
      }
    }

    const avgRating = parseFloat((sum / totalCount).toFixed(1));
    const ratingPercentages = {};
    for (let star = 1; star <= 5; star += 1) {
      ratingPercentages[String(star)] = Math.round((buckets[star] / totalCount) * 100);
    }

    return res.json({ avgRating, totalCount, ratingPercentages });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

// Create or update current user's review for a product
router.post('/:productId', async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    const { rating, comment } = req.body || {};

    const val = Number(rating);
    if (!productId) return res.status(400).json({ error: 'Invalid product id' });
    if (!val || Number.isNaN(val) || val < 1 || val > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) return res.status(404).json({ error: 'Product not found' });

    const review = await prisma.review.upsert({
      where: { userId_productId: { userId, productId } },
      update: { rating: val, comment: comment ?? null },
      create: { userId, productId, rating: val, comment: comment ?? null },
    });

    return res.status(201).json(review);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;
