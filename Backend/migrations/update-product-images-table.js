const { DataTypes } = require('sequelize');
const sequelize = require('../db');

async function updateProductImagesTable() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    
    // Add missing columns
    await queryInterface.addColumn('ProductImages', 'isPrimary', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    
    await queryInterface.addColumn('ProductImages', 'displayOrder', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
    
    console.log('ProductImages table updated successfully!');
    
    // Verify the updated structure
    const ProductImage = require('../Models/ProductImage');
    const description = await ProductImage.describe();
    console.log('Updated ProductImages table schema:', Object.keys(description));
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Columns already exist in ProductImages table');
    } else {
      console.error('Error updating ProductImages table:', error);
    }
  }
  
  await sequelize.close();
}

updateProductImagesTable();
