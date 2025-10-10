const Rating = require('../Models/Rating');

exports.createRating = async (req, res) => {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll();
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findByPk(req.params.id);
    if (rating) res.json(rating);
    else res.status(404).json({ error: 'Rating not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const [updated] = await Rating.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRating = await Rating.findByPk(req.params.id);
      res.json(updatedRating);
    } else {
      res.status(404).json({ error: 'Rating not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const deleted = await Rating.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Rating deleted' });
    else res.status(404).json({ error: 'Rating not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
