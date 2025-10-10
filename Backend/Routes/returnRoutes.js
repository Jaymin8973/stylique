const express = require('express');
const router = express.Router();
const returnController = require('../Controllers/returnController');

router.post('/', returnController.createReturn);
router.get('/', returnController.getReturns);
router.get('/:id', returnController.getReturnById);
router.put('/:id', returnController.updateReturn);
router.delete('/:id', returnController.deleteReturn);

module.exports = router;
