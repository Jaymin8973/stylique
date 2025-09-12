const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const Category = require('./Categories');


const SubCategory = sequelize.define('SubCategory', {
    subcat_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'cat_id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


Category.hasMany(SubCategory, { foreignKey: 'cat_id', onDelete: 'CASCADE' });
SubCategory.belongsTo(Category, { foreignKey: 'cat_id' });


module.exports = SubCategory ;
