const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');

const ProductVariant = sequelize.define('ProductVariant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'id' },
    allowNull: false,
  },
  color: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  sku: { type: DataTypes.STRING, unique: true },
  stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  timestamps: true,
});

Product.hasMany(ProductVariant, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId' });

module.exports = ProductVariant;
