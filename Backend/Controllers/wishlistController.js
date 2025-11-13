const Wishlist = require('../Models/Wishlist');
const WishlistItem = require('../Models/WishlistItem');
const Product = require('../Models/Product');

exports.addToWishlist = async (req, res) => {
  try {
    const { user_id, productId } = req.body;
    
    if (!user_id || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    // Check if product already exists in wishlist
    const existingItem = await WishlistItem.findOne({
      where: { user_id, productId }
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    const wishlistItem = await WishlistItem.create({ user_id, productId });
    
    // Return the wishlist item with product details
    const itemWithProduct = await WishlistItem.findByPk(wishlistItem.id, {
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'imageUrl'] }]
    });

    res.status(201).json(itemWithProduct);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { user_id, productId } = req.body;
    
    if (!user_id || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    const deleted = await WishlistItem.destroy({
      where: { user_id, productId }
    });

    if (deleted) {
      res.json({ message: 'Product removed from wishlist' });
    } else {
      res.status(404).json({ error: 'Wishlist item not found' });
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const wishlistItems = await WishlistItem.findAll({
      where: { user_id },
      include: [{ 
        model: Product, 
        attributes: ['id', 'name', 'price', 'imageUrl', 'brand', 'description'] 
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.isInWishlist = async (req, res) => {
  try {
    const { user_id, productId } = req.params;
    
    if (!user_id || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    const wishlistItem = await WishlistItem.findOne({
      where: { user_id, productId }
    });

    res.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.create(req.body);
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.findAll();
    res.json(wishlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWishlistById = async (req, res) => {
  try {
    const wishlist = await Wishlist.findByPk(req.params.id);
    if (wishlist) res.json(wishlist);
    else res.status(404).json({ error: 'Wishlist not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWishlist = async (req, res) => {
  try {
    const [updated] = await Wishlist.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedWishlist = await Wishlist.findByPk(req.params.id);
      res.json(updatedWishlist);
    } else {
      res.status(404).json({ error: 'Wishlist not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWishlist = async (req, res) => {
  try {
    const deleted = await Wishlist.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Wishlist deleted' });
    else res.status(404).json({ error: 'Wishlist not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
