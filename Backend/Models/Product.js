const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Categories = require('./Categories');
const SubCategory = require('./SubCategory');



const Product = sequelize.define('Product', {
    productId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    color: { type: DataTypes.STRING },
    size: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    imageUrl: DataTypes.STRING,
    subcat_id: { type: DataTypes.INTEGER,
        references: { model: SubCategory, key: 'subcat_id' },
        allowNull: false,
    },
    cat_id: { type: DataTypes.INTEGER,
        references: { model: Categories, key: 'cat_id' },
        allowNull: false,
    }
}, {
    timestamps: true,
});




;
Categories.hasMany(Product, { foreignKey: 'cat_id' });
Product.belongsTo(Categories, { foreignKey: 'cat_id' });

SubCategory.hasMany(Product, { foreignKey: 'subcat_id', onDelete: 'CASCADE' });
Product.belongsTo(SubCategory, { foreignKey: 'subcat_id' });

module.exports = Product ;