import { Router } from 'express';
import prisma from '../prismaClient.js';
import auth from '../middleware/auth.js';

const router = Router();

// Create a new collection and optionally attach products
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, imageUrl, status, productIds } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const userId = Number(req.user.id);

    const data = {
      name: name.trim(),
      description: description?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      status: status && typeof status === 'string' ? status : 'draft',
      userId,
      items: Array.isArray(productIds) && productIds.length
        ? {
            create: productIds.map((pid) => ({ productId: Number(pid) })),
          }
        : undefined,
    };

    const created = await prisma.collection.create({
      data,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(201).json(created);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create collection', details: e?.message });
  }
});

// List collections for the current user (seller dashboard)
router.get('/', auth, async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const collections = await prisma.collection.findMany({
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

    return res.json(collections);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Update a collection (name/description/image/status/products)
router.put('/:id', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.user.id);
    const { name, description, imageUrl, status, productIds } = req.body || {};

    const existing = await prisma.collection.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const data = {};
    if (name !== undefined) data.name = String(name).trim();
    if (description !== undefined) data.description = description ? String(description).trim() : null;
    if (imageUrl !== undefined) data.imageUrl = imageUrl ? String(imageUrl).trim() : null;
    if (status !== undefined) data.status = String(status);

    // If productIds provided, replace collection items
    if (Array.isArray(productIds)) {
      await prisma.collectionitem.deleteMany({ where: { collectionId: id } });
      if (productIds.length) {
        data.items = {
          create: productIds.map((pid) => ({ productId: Number(pid) })),
        };
      }
    }

    const updated = await prisma.collection.update({
      where: { id },
      data,
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to update collection' });
  }
});

// Delete a collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.user.id);

    const existing = await prisma.collection.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    await prisma.collection.delete({ where: { id } });
    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to delete collection' });
  }
});

// Public endpoint: list active collections for mobile app
router.get('/public', async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        status: true,
        createdAt: true,
      },
    });

    return res.json(collections);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Public endpoint: get a single collection with products
router.get('/public/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid collection id' });
    }

    const collection = await prisma.collection.findFirst({
      where: { id, status: 'active' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    return res.json(collection);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

export default router;
