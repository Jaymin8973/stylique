const express = require('express');
const { getAllSubCategories } = require('../Controllers/SubCategory');
const router = express.Router();

router.get('/', getAllSubCategories);


module.exports = router;