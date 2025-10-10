const OrderItem = require('../Models/OrderItem');

exports.createOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ error: 'Order item not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const [updated] = await OrderItem.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedItem = await OrderItem.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItem.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Order item deleted' });
    else res.status(404).json({ error: 'Order item not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
