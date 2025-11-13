const express = require('express');
const router = express.Router();
const wishlistController = require('../Controllers/wishlistController');

// New wishlist item endpoints
router.post('/add', wishlistController.addToWishlist);
router.post('/remove', wishlistController.removeFromWishlist);
router.get('/user/:user_id', wishlistController.getUserWishlist);
router.get('/check/:user_id/:productId', wishlistController.isInWishlist);

// Original wishlist endpoints
router.post('/', wishlistController.createWishlist);
router.get('/', wishlistController.getWishlists);
router.get('/:id', wishlistController.getWishlistById);
router.put('/:id', wishlistController.updateWishlist);
router.delete('/:id', wishlistController.deleteWishlist);

module.exports = router;
