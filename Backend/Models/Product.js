const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const ProductImage = require('./ProductImage');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  brand: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING },
  categoryId: {
    type: DataTypes.INTEGER,
    references: { model: Category, key: 'id' },
    allowNull: false,
  },
  subCategoryId: {
    type: DataTypes.INTEGER,
    references: { model: SubCategory, key: 'id' },
    allowNull: false,
  },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  timestamps: true,
});

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

SubCategory.hasMany(Product, { foreignKey: 'subCategoryId' });
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId' });

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Product;
