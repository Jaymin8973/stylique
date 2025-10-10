const express = require('express');
const router = express.Router();
const orderItemController = require('../Controllers/orderItemController');

router.post('/', orderItemController.createOrderItem);
router.get('/', orderItemController.getOrderItems);
router.get('/:id', orderItemController.getOrderItemById);
router.put('/:id', orderItemController.updateOrderItem);
router.delete('/:id', orderItemController.deleteOrderItem);

module.exports = router;
