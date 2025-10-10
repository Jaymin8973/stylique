const express = require('express');
const router = express.Router();
const wishlistController = require('../Controllers/wishlistController');

router.post('/', wishlistController.createWishlist);
router.get('/', wishlistController.getWishlists);
router.get('/:id', wishlistController.getWishlistById);
router.put('/:id', wishlistController.updateWishlist);
router.delete('/:id', wishlistController.deleteWishlist);

module.exports = router;
