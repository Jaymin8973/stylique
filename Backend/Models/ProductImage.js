const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ProductImage = sequelize.define('ProductImage', {
  imageId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false
  },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  isPrimary: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
    allowNull: false
  },
  displayOrder: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'ProductImages'
});

module.exports = ProductImage;
