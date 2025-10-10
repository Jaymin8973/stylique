const Wishlist = require('../Models/Wishlist');

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
