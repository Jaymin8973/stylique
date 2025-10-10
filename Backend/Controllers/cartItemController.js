const CartItem = require('../Models/CartItem');

exports.createCartItem = async (req, res) => {
  try {
    const item = await CartItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const items = await CartItem.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartItemById = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ error: 'Cart Item not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const [updated] = await CartItem.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedItem = await CartItem.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Cart Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const deleted = await CartItem.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Cart Item deleted' });
    else res.status(404).json({ error: 'Cart Item not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
