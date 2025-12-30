import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';

const router = Router();

router.use(authAny);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true, variant: true },
          },
        },
      });
    }

    const items = cart.items.map((ci) => ({
      id: ci.id,
      productId: ci.productId,
      variantId: ci.variantId,
      quantity: ci.quantity,
      unitPrice: ci.unitPrice,
      lineTotal: String(parseFloat(ci.unitPrice || '0') * ci.quantity),
      product: {
        id: ci.product.id,
        productName: ci.product.productName,
        imageUrl: ci.product.imageUrl,
        sellingPrice: ci.product.sellingPrice,
        brand: ci.product.brand,
      },
      variant: ci.variant
        ? {
          id: ci.variant.id,
          size: ci.variant.size,
          color: ci.variant.color,
          price: ci.variant.price,
        }
        : null,
    }));

    const subtotal = items.reduce((sum, it) => sum + parseFloat(it.unitPrice || '0') * it.quantity, 0);

    res.json({ id: cart.id, items, subtotal, itemCount: items.reduce((s, it) => s + it.quantity, 0) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantId, quantity, salePrice } = req.body || {};
    const qty = Math.max(1, Number(quantity || 1));

    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let variant = null;
    if (variantId) {
      variant = await prisma.variant.findUnique({ where: { id: Number(variantId) } });
      if (!variant) return res.status(404).json({ error: 'Variant not found' });
    }

    // Use salePrice if provided (from sale), otherwise use variant price or product selling price
    let unitPrice;
    if (salePrice !== undefined && salePrice !== null && salePrice !== '') {
      unitPrice = String(salePrice);
    } else {
      unitPrice = String(variant?.price ?? product.sellingPrice ?? '0');
    }

    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });

    const existing = await prisma.cartitem.findFirst({
      where: {
        cartId: cart.id,
        productId: Number(productId),
        variantId: variant ? variant.id : null,
      },
    });

    let item;
    if (existing) {
      item = await prisma.cartitem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + qty, unitPrice },
      });
    } else {
      item = await prisma.cartitem.create({
        data: {
          cartId: cart.id,
          productId: Number(productId),
          variantId: variant ? variant.id : null,
          quantity: qty,
          unitPrice,
        },
      });
    }

    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to add to cart', details: e?.message });
  }
});

router.patch('/item/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body || {};
    const qty = Number(quantity);
    if (Number.isNaN(qty)) return res.status(400).json({ error: 'quantity is required' });
    if (qty <= 0) {
      await prisma.cartitem.delete({ where: { id } });
      return res.json({ success: true });
    }
    const updated = await prisma.cartitem.update({ where: { id }, data: { quantity: qty } });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update item' });
  }
});

router.delete('/item/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.cartitem.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to remove item' });
  }
});

router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user.id;
    const c = await prisma.cart.findFirst({ where: { userId } });
    if (!c) return res.json({ success: true });
    await prisma.cartitem.deleteMany({ where: { cartId: c.id } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to clear cart' });
  }
});

export default router;
