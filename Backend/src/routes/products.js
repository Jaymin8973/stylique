import { Router } from 'express';
import prisma from '../prismaClient.js';
import auth from '../middleware/auth.js';

const router = Router();
// Protect all product routes
//  router.use(auth);



// List all products
router.get('/',  async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
      include: {
        productimage: true,
        variant: true,
        clothingdetail: true,
        footweardetail: true,
        accessorydetail: true,
      },
    });
    res.json(products);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


router.get('/all', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
      include: {
        productimage: true,
        variant: true,
        clothingdetail: true,
        footweardetail: true,
        accessorydetail: true,
      },
    });
    res.json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/categoryCounts', async (req, res) => {
  try {

    const productTypes = ['clothing', 'footwear', 'accessories'];

    const results = {};

    for (const type of productTypes) {
      const data = await prisma.product.groupBy({
        by: ['subcategory'],
        where: { productType: type },
        _count: { subcategory: true }
      });

      results[type] = data.map(r => ({
        subCategory: r.subcategory,
        count: r._count.subcategory
      }));
    }

    res.json(results);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch category counts' });
  }
});


// Get one product by id
router.get('/:id', async (req, res) =>{ 
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findFirst({
      where: { id },
      include: {
        productimage: true,
        variant: true,
        clothingdetail: true,
        footweardetail: true,
        accessorydetail: true,
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.get('/pid/:id', async (req, res) =>{ 
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findFirst({
      where: {id},
      include: {
        productimage: true,
        variant: true,
        clothingdetail: true,
        footweardetail: true,
        accessorydetail: true,
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/',auth, async (req, res) => {
  try {
    const { images, variants, ...fields } = req.body;

    // Extract clothing-specific fields (now live in ClothingDetail)
    const clothingFields = (({
      material,
      fabric,
      pattern,
      collarType,
      sleeveType,
      fit,
      occasion,
      season,
      careInstructions,
    }) => ({
      material,
      fabric,
      pattern,
      collarType,
      sleeveType,
      fit,
      occasion,
      season,
      careInstructions,
    }))(fields);

    // Extract footwear-specific fields (now live in FootwearDetail)
    const footwearFields = (({
      footwearType,
      heelHeight,
      soleMaterial,
      upperMaterial,
      closure,
    }) => ({
      footwearType,
      heelHeight,
      soleMaterial,
      upperMaterial,
      closure,
    }))(fields);

    // Extract accessory-specific fields (now live in AccessoryDetail)
    const accessoryFields = (({
      accessoryType,
      dimensions,
      weight,
    }) => ({
      accessoryType,
      dimensions,
      weight,
    }))(fields);

    // Remove relation fields from top-level Product payload
    ['material','fabric','pattern','collarType','sleeveType','fit','occasion','season','careInstructions']
      .forEach((k) => delete fields[k]);
    ['footwearType','heelHeight','soleMaterial','upperMaterial','closure']
      .forEach((k) => delete fields[k]);
    ['accessoryType','dimensions','weight']
      .forEach((k) => delete fields[k]);

    const now = new Date();
    const created = await prisma.product.create({
      data: {
        ...fields,
        userId: req.user.id,
        updatedAt: now,
        // create clothingDetail only if at least one field is present/non-empty
        clothingdetail: Object.values(clothingFields).some((v) => v !== undefined && v !== null && String(v).length > 0)
          ? { create: clothingFields }
          : undefined,
        footweardetail: Object.values(footwearFields).some((v) => v !== undefined && v !== null && String(v).length > 0)
          ? { create: footwearFields }
          : undefined,
        accessorydetail: Object.values(accessoryFields).some((v) => v !== undefined && v !== null && String(v).length > 0)
          ? { create: accessoryFields }
          : undefined,
        productimage: images?.length
          ? { create: images.map((i) => ({ url: i.url, isPrimary: !!i.isPrimary })) }
          : undefined,
        variant: variants?.length
          ? { create: variants.map((v) => ({
              size: v.size ?? null,
              color: v.color ?? null,
              stock: Number(v.stock ?? 0),
              price: String(v.price ?? '0'),
              sku: v.sku ?? null,
            })) }
          : undefined,
      },
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to create product', details: e?.message });
  }
});

// Update product
router.put('/:id', auth,async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { images, variants, ...fields } = req.body;

    // Basic existence check
    const owned = await prisma.product.findFirst({ where: { id } });
    if (!owned) return res.status(404).json({ error: 'Product not found' });

    const clothingFields = (({
      material,
      fabric,
      pattern,
      collarType,
      sleeveType,
      fit,
      occasion,
      season,
      careInstructions,
    }) => ({
      material,
      fabric,
      pattern,
      collarType,
      sleeveType,
      fit,
      occasion,
      season,
      careInstructions,
    }))(fields);

    // Footwear fields
    const footwearFields = (({
      footwearType,
      heelHeight,
      soleMaterial,
      upperMaterial,
      closure,
    }) => ({
      footwearType,
      heelHeight,
      soleMaterial,
      upperMaterial,
      closure,
    }))(fields);

    // Accessory fields
    const accessoryFields = (({
      accessoryType,
      dimensions,
      weight,
    }) => ({
      accessoryType,
      dimensions,
      weight,
    }))(fields);

    // Remove relation fields from top-level Product payload
    ['material','fabric','pattern','collarType','sleeveType','fit','occasion','season','careInstructions']
      .forEach((k) => delete fields[k]);
    ['footwearType','heelHeight','soleMaterial','upperMaterial','closure']
      .forEach((k) => delete fields[k]);
    ['accessoryType','dimensions','weight']
      .forEach((k) => delete fields[k]);

    // Basic update
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...fields,
        userId: req.user.id,
        updatedAt: new Date(),
        // If any clothing fields are supplied, upsert ClothingDetail
        ...(Object.values(clothingFields).some((v) => v !== undefined)
          ? {
              clothingdetail: {
                upsert: {
                  create: clothingFields,
                  update: clothingFields,
                },
              },
            }
          : {}),
        // If any footwear fields are supplied, upsert FootwearDetail
        ...(Object.values(footwearFields).some((v) => v !== undefined)
          ? {
              footweardetail: {
                upsert: {
                  create: footwearFields,
                  update: footwearFields,
                },
              },
            }
          : {}),
        // If any accessory fields are supplied, upsert AccessoryDetail
        ...(Object.values(accessoryFields).some((v) => v !== undefined)
          ? {
              accessorydetail: {
                upsert: {
                  create: accessoryFields,
                  update: accessoryFields,
                },
              },
            }
          : {}),
      },
    });

    // Replace images if provided
    if (Array.isArray(images)) {
      await prisma.productimage.deleteMany({ where: { productId: id } });
      if (images.length) {
        await prisma.product.update({
          where: { id },
          data: {
            productimage: {
              create: images.map((i) => ({ url: i.url, isPrimary: !!i.isPrimary })),
            },
          },
        });
      }
    }

    // Replace variants if provided
    if (Array.isArray(variants)) {
      await prisma.variant.deleteMany({ where: { productId: id } });
      if (variants.length) {
        await prisma.product.update({
          where: { id },
          data: {
            variant: {
              create: variants.map((v) => ({
                size: v.size ?? null,
                color: v.color ?? null,
                stock: Number(v.stock ?? 0),
                price: String(v.price ?? '0'),
                sku: v.sku ?? null,
              })),
            },
          },
        });
      }
    }

    const final = await prisma.product.findUnique({ where: { id } });
    res.json(final);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update product', details: e?.message });
  }
})
;

// Delete product
router.delete('/:id',auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const owned = await prisma.product.findFirst({ where: { id } });
    if (!owned) return res.status(404).json({ error: 'Product not found' });
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to delete product' });
  }
});


router.post('/subcat', async (req, res) =>{ 
  try {
    const {subcategory} = req.body;
    const product = await prisma.product.findMany({
      where: { subcategory:subcategory },
      include: {
        productimage: true,
        variant: true,
        clothingdetail: true,
        footweardetail: true,
        accessorydetail: true,
      },
    });
    console.log(product)
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});



export default router;
