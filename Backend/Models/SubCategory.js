const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./Category');

const SubCategory = sequelize.define('SubCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  categoryId: {
    type: DataTypes.INTEGER,
    references: { model: Category, key: 'id' },
    allowNull: false,
  }
}, {
  timestamps: true,
});

Category.hasMany(SubCategory, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = SubCategory;
