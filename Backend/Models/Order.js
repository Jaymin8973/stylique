const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'user_id' },
    allowNull: false,
  },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, processing, shipped, delivered, cancelled, returned
  shippingAddress: { type: DataTypes.TEXT },
  billingAddress: { type: DataTypes.TEXT },
}, {
  timestamps: true,
});

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Order;
