const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const ProductImages = sequelize.define('ProductImages', {
  imageId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false }
});

module.exports = ProductImages;