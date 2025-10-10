const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Cart = require('./Cart');
const ProductVariant = require('./ProductVariant');

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cartId: {
    type: DataTypes.INTEGER,
    references: { model: Cart, key: 'id' },
    allowNull: false,
  },
  variantId: {
    type: DataTypes.INTEGER,
    references: { model: ProductVariant, key: 'id' },
    allowNull: false,
  },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  priceAtAddition: { type: DataTypes.FLOAT, allowNull: false }
}, {
  timestamps: true,
});

Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

ProductVariant.hasMany(CartItem, { foreignKey: 'variantId' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId' });

module.exports = CartItem;
