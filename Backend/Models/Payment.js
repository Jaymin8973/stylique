const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Order = require('./Order');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'user_id' },
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    references: { model: Order, key: 'id' },
    allowNull: false,
  },
  paymentType: { type: DataTypes.STRING },  
  transactionId: { type: DataTypes.STRING },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending, success, failed, refunded
}, {
  timestamps: true,
});

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(Payment, { foreignKey: 'orderId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Payment;
