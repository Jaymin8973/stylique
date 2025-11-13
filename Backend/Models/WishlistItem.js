const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Product = require('./Product');

const WishlistItem = sequelize.define('WishlistItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'user_id' },
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'id' },
    allowNull: false,
  }
}, {
  timestamps: true,
  // Add composite unique constraint to prevent duplicate wishlist items
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'productId']
    }
  ]
});

User.hasMany(WishlistItem, { foreignKey: 'user_id' });
WishlistItem.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(WishlistItem, { foreignKey: 'productId' });
WishlistItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = WishlistItem;
