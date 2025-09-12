
const User = require('./User');
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');

const ProductRating = sequelize.define('ProductRating', {
    productRatingId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: {
        type: DataTypes.INTEGER,
        references: { model: Product, key: 'productId' },
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' },
        allowNull: false,
    },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    comment: { type: DataTypes.TEXT },
}, {
    timestamps: true,
});


ProductRating.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(ProductRating, { foreignKey: 'productId' })

ProductRating.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(ProductRating, { foreignKey: 'user_id' });

module.exports = ProductRating;