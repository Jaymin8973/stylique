const express = require('express');
const { getAllCategories } = require('../Controllers/CategoryController');
const router = express.Router();

router.get('/', getAllCategories);


module.exports = router;