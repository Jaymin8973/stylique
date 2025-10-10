const express = require('express');
const router = express.Router();
const productVariantController = require('../Controllers/productVariantController');

router.post('/', productVariantController.createVariant);
router.get('/', productVariantController.getVariants);
router.get('/:id', productVariantController.getVariantById);
router.put('/:id', productVariantController.updateVariant);
router.delete('/:id', productVariantController.deleteVariant);

module.exports = router;
