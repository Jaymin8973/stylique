import { Router } from 'express';
import prisma from '../prismaClient.js';
import auth from '../middleware/auth.js';

const router = Router();

// Create a new sale and attach products, optionally applying discount immediately
router.post('/', auth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const {
      name,
      description,
      bannerUrl,
      discountType,
      discountValue,
      status,
      startAt,
      endAt,
      productIds,
    } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Sale name is required' });
    }

    if (!discountType || String(discountType) !== 'percent') {
      return res.status(400).json({ error: 'Only percent discount type is supported for now' });
    }

    if (discountValue === undefined || discountValue === null || String(discountValue).trim() === '') {
      return res.status(400).json({ error: 'Discount value is required' });
    }

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'At least one product must be selected for the sale' });
    }

    const cleanName = String(name).trim();
    const cleanDescription = description ? String(description).trim() : null;
    const cleanBannerUrl = bannerUrl ? String(bannerUrl).trim() : null;
    const cleanDiscountType = String(discountType);
    const cleanDiscountValue = String(discountValue).trim();
    const saleStatus = status && typeof status === 'string' ? status : 'draft';

    const parsedStartAt = startAt ? new Date(startAt) : null;
    const parsedEndAt = endAt ? new Date(endAt) : null;

    const uniqueProductIds = Array.from(
      new Set(
        productIds
          .map((pid) => Number(pid))
          .filter((pid) => Number.isFinite(pid) && pid > 0)
      )
    );

    if (!uniqueProductIds.length) {
      return res.status(400).json({ error: 'No valid product ids provided' });
    }

    const created = await prisma.sale.create({
      data: {
        name: cleanName,
        description: cleanDescription,
        bannerUrl: cleanBannerUrl,
        discountType: cleanDiscountType,
        discountValue: cleanDiscountValue,
        status: saleStatus,
        startAt: parsedStartAt,
        endAt: parsedEndAt,
        userId,
        items: {
          create: uniqueProductIds.map((productId) => ({ productId })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (saleStatus === 'active' && cleanDiscountType === 'percent') {
      await prisma.product.updateMany({
        where: {
          id: { in: uniqueProductIds },
          userId,
        },
        data: {
          discountPercent: cleanDiscountValue,
        },
      });
    }

    return res.status(201).json(created);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create sale', details: e?.message });
  }
});

// List sales for the current seller
router.get('/', auth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const sales = await prisma.sale.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.json(sales);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Public endpoint: list active sales for mobile app
router.get('/public', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        bannerUrl: true,
        discountType: true,
        discountValue: true,
        startAt: true,
        endAt: true,
        status: true,
        createdAt: true,
      },
    });

    return res.json(sales);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Public endpoint: get a single sale with products
router.get('/public/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid sale id' });
    }

    const sale = await prisma.sale.findFirst({
      where: { id, status: 'active' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    return res.json(sale);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch sale' });
  }
});

export default router;
