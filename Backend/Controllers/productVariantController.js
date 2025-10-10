const ProductVariant = require('../Models/ProductVariant');

exports.createVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.create(req.body);
    res.status(201).json(variant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.findAll();
    res.json(variants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVariantById = async (req, res) => {
  try {
    const variant = await ProductVariant.findByPk(req.params.id);
    if (variant) res.json(variant);
    else res.status(404).json({ error: 'Variant not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const [updated] = await ProductVariant.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedVariant = await ProductVariant.findByPk(req.params.id);
      res.json(updatedVariant);
    } else {
      res.status(404).json({ error: 'Variant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const deleted = await ProductVariant.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Variant deleted' });
    else res.status(404).json({ error: 'Variant not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
