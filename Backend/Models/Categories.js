const {DataTypes} = require('sequelize');
const sequelize = require('../db');


const Category = sequelize.define('Category', {
    cat_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});



module.exports = Category ;
