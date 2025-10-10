const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Order = require('./Order');
const ProductVariant = require('./ProductVariant');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: {
    type: DataTypes.INTEGER,
    references: { model: Order, key: 'id' },
    allowNull: false,
  },
  variantId: {
    type: DataTypes.INTEGER,
    references: { model: ProductVariant, key: 'id' },
    allowNull: false,
  },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, allowNull: false }
}, {
  timestamps: true,
});

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId' });

module.exports = OrderItem;
