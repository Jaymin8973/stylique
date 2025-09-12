const ProductRating = require('../Models/ProductRating');
const { fn, col, literal } = require('sequelize');

exports.addProductRating = async (req, res) => {
    try {
        const newRating = await productRatting.create(req.body);
        res.status(201).json(newRating);
    }
    catch (error) {
        console.error('Error adding product rating:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProductRatingsById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const ratings = await productRatting.findAll({ where: { productId } });
    res.status(200).json(ratings);
  }
    catch (error) {
        console.error('Error fetching product ratings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllProductRatings = async (req, res) => {
  try {
    const ratings = await productRating.findAll();
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching all product ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.getDetailedRatingStats = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const overall = await ProductRating.findOne({
      where: { productId: id },
      attributes: [
        [fn('AVG', col('rating')), 'avgRating'],
        [fn('COUNT', col('user_id')), 'totalCount'],
      ],
      raw: true,
    });

    const counts = await ProductRating.findAll({
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

    const totalCount = parseInt(overall.totalCount, 10);
    const ratingPercentages = {};

    Object.keys(ratingCounts).forEach(key => {
      const count = ratingCounts[key];
      ratingPercentages[key] = totalCount > 0 ? ((count / totalCount) * 100).toFixed(0) : "0";
    });

    res.json({
      avgRating: overall.avgRating ? parseFloat(overall.avgRating).toFixed(2) : 0,
      totalCount,
      ratingCounts,
      ratingPercentages
    });

  } catch (error) {
    console.error('Error fetching rating stats:', error);
    res.status(500).json({ error: 'Server error while fetching rating stats' });
  }
};


