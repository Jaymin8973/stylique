import { Router } from 'express';
import prisma from '../prismaClient.js';
import authAny from '../middleware/authAny.js';

const router = Router();

router.use(authAny);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(addresses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid address id' });

    const address = await prisma.address.findFirst({ where: { id, userId } });
    if (!address) return res.status(404).json({ error: 'Address not found' });

    res.json(address);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      mobileNumber,
      pincode,
      houseNo,
      street,
      city,
      state,
      isDefault,
    } = req.body || {};

    if (!firstName || !mobileNumber || !pincode || !houseNo || !street || !city || !state) {
      return res.status(400).json({ error: 'Missing required address fields' });
    }

    const existingCount = await prisma.address.count({ where: { userId } });
    const makeDefault = existingCount === 0 || !!isDefault;

    if (makeDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    const created = await prisma.address.create({
      data: {
        userId,
        firstName,
        lastName: lastName ?? null,
        mobileNumber,
        pincode,
        houseNo,
        street,
        city,
        state,
        isDefault: makeDefault,
      },
    });

    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create address', details: e?.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid address id' });

    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Address not found' });

    const {
      firstName,
      lastName,
      mobileNumber,
      pincode,
      houseNo,
      street,
      city,
      state,
      isDefault,
    } = req.body || {};

    const data = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (mobileNumber !== undefined) data.mobileNumber = mobileNumber;
    if (pincode !== undefined) data.pincode = pincode;
    if (houseNo !== undefined) data.houseNo = houseNo;
    if (street !== undefined) data.street = street;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;

    if (isDefault === true) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
      data.isDefault = true;
    }

    const updated = await prisma.address.update({ where: { id }, data });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update address', details: e?.message });
  }
});

router.patch('/:id/default', async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid address id' });

    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Address not found' });

    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    const updated = await prisma.address.update({ where: { id }, data: { isDefault: true } });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to set default address', details: e?.message });
  }
});

export default router;
