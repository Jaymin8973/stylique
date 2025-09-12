const express = require('express');
const { addProduct, getAllProducts, getProductById } = require('../Controllers/ProductController');
const router = express.Router();


router.post('/', addProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;