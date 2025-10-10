const Discount = require('../Models/Discount');

exports.createDiscount = async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.findAll();
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);
    if (discount) res.json(discount);
    else res.status(404).json({ error: 'Discount not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const [updated] = await Discount.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedDiscount = await Discount.findByPk(req.params.id);
      res.json(updatedDiscount);
    } else {
      res.status(404).json({ error: 'Discount not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const deleted = await Discount.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Discount deleted' });
    else res.status(404).json({ error: 'Discount not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
