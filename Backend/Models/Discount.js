const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Discount = sequelize.define('Discount', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.TEXT },
  discountType: { type: DataTypes.STRING }, // percentage, flat
  discountValue: { type: DataTypes.FLOAT, allowNull: false },
  minPurchaseAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  maxDiscountAmount: { type: DataTypes.FLOAT },
  validFrom: { type: DataTypes.DATE },
  validTo: { type: DataTypes.DATE },
  usageLimit: { type: DataTypes.INTEGER, defaultValue: 1 },
  usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
});

module.exports = Discount;
