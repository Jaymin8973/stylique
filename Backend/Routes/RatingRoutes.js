const express = require('express');
const { addProductRating, getDetailedRatingStats, getAllProductRatings } = require('../Controllers/ProductRating');
const router = express.Router();


router.post('/', addProductRating);
router.get('/:id', getDetailedRatingStats);
router.get('/', getAllProductRatings);

module.exports = router;
