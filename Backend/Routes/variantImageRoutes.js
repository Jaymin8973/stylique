const express = require('express');
const router = express.Router();
const variantImageController = require('../Controllers/variantImageController');

router.post('/', variantImageController.createImage);
router.get('/', variantImageController.getImages);
router.get('/:id', variantImageController.getImageById);
router.put('/:id', variantImageController.updateImage);
router.delete('/:id', variantImageController.deleteImage);

module.exports = router;
