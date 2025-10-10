const VariantImage = require('../Models/VariantImage');

exports.createImage = async (req, res) => {
  try {
    const image = await VariantImage.create(req.body);
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await VariantImage.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImageById = async (req, res) => {
  try {
    const image = await VariantImage.findByPk(req.params.id);
    if (image) res.json(image);
    else res.status(404).json({ error: 'Image not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const [updated] = await VariantImage.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedImage = await VariantImage.findByPk(req.params.id);
      res.json(updatedImage);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const deleted = await VariantImage.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Image deleted' });
    else res.status(404).json({ error: 'Image not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
