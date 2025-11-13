const Rating = require('../Models/Rating');
const { fn, col } = require('sequelize');

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

exports.getProductRating = async (req, res) => {
  try {
    const { id } = req.params;
    
    const overall = await Rating.findOne({
      where: { productId: id },
      attributes: [
        [fn('AVG', col('rating')), 'avgRating'],
        [fn('COUNT', col('id')), 'totalCount'],
      ],
      raw: true,
    });

    const counts = await Rating.findAll({
      where: { productId: id },
      attributes: [
        'rating',
        [fn('COUNT', col('rating')), 'count']
      ],
      group: ['rating'],
      raw: true,
    });

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    counts.forEach(item => {
      const rating = Math.round(item.rating);
      ratingCounts[rating] = parseInt(item.count, 10);
    });

    const totalCount = parseInt(overall.totalCount, 10) || 0;
    const ratingPercentages = {};

    Object.keys(ratingCounts).forEach(key => {
      const count = ratingCounts[key];
      ratingPercentages[key] = totalCount > 0 ? ((count / totalCount) * 100).toFixed(0) : "0";
    });

    res.json({
      avgRating: overall.avgRating ? parseFloat(overall.avgRating).toFixed(2) : 0,
      totalCount,
      ratingPercentages
    });

  } catch (error) {
    console.error('Error fetching product rating:', error);
    res.status(500).json({ error: 'Server error while fetching rating stats' });
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
