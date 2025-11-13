const express = require('express');
const router = express.Router();
const ratingController = require('../Controllers/RatingController');

router.post('/', ratingController.createRating);
router.get('/', ratingController.getRatings);
router.get('/:id', ratingController.getProductRating);
router.put('/:id', ratingController.updateRating);
router.delete('/:id', ratingController.deleteRating);

module.exports = router;
