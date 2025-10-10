const Cart = require('../Models/Cart');

exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (cart) res.json(cart);
    else res.status(404).json({ error: 'Cart not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const [updated] = await Cart.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedCart = await Cart.findByPk(req.params.id);
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const deleted = await Cart.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Cart deleted' });
    else res.status(404).json({ error: 'Cart not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
