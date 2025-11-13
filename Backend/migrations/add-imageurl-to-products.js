const { DataTypes } = require('sequelize');
const sequelize = require('../db');

async function addImageUrlColumn() {
  try {
    // Get the current Product model definition
    const queryInterface = sequelize.getQueryInterface();
    
    // Add imageUrl column to Products table
    await queryInterface.addColumn('Products', 'imageUrl', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    console.log('imageUrl column added successfully to Products table!');
    
    // Verify the column was added
    const Product = require('../Models/Product');
    const description = await Product.describe();
    console.log('Updated Products table schema:', Object.keys(description));
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('imageUrl column already exists in Products table');
    } else {
      console.error('Error adding imageUrl column:', error);
    }
  }
  
  await sequelize.close();
}

addImageUrlColumn();
