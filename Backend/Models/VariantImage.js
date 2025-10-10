const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const ProductVariant = require('./ProductVariant');

const VariantImage = sequelize.define('VariantImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  variantId: {
    type: DataTypes.INTEGER,
    references: { model: ProductVariant, key: 'id' },
    allowNull: false,
  },
  imageUrl: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: true,
});

ProductVariant.hasMany(VariantImage, { foreignKey: 'variantId', onDelete: 'CASCADE' });
VariantImage.belongsTo(ProductVariant, { foreignKey: 'variantId' });

module.exports = VariantImage;
