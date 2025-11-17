import { Router } from 'express';
import authAny from '../middleware/authAny.js';

const router = Router();

router.use(authAny);

router.post('/charge', async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, currency = 'INR', method = 'card' } = req.body || {};
    const numericAmount = Number(amount);

    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const transactionId = `tx_${Date.now()}_${userId}`;

    return res.json({
      success: true,
      transactionId,
      amount: numericAmount,
      currency,
      method,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to process payment' });
  }
});

export default router;
