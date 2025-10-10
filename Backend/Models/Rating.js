const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Product = require('./Product');

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'user_id' },
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'id' },
    allowNull: false
  },
  rating: { type: DataTypes.INTEGER, allowNull: false }, // 1 to 5
  review: { type: DataTypes.TEXT }
}, {
  timestamps: true,
});

User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Product.hasMany(Rating, { foreignKey: 'productId' });
Rating.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Rating;
