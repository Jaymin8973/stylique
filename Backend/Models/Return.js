const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const OrderItem = require('./OrderItem');

const Return = sequelize.define('Return', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderItemId: {
    type: DataTypes.INTEGER,
    references: { model: OrderItem, key: 'id' },
    allowNull: false
  },
  reason: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'requested' }, // requested, approved, rejected, refunded
  refundAmount: { type: DataTypes.FLOAT }
}, {
  timestamps: true,
});

OrderItem.hasMany(Return, { foreignKey: 'orderItemId', onDelete: 'CASCADE' });
Return.belongsTo(OrderItem, { foreignKey: 'orderItemId' });

module.exports = Return;
