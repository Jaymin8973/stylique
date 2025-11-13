const { DataTypes } = require('sequelize');
const sequelize = require('../db');

async function createProductImagesTable() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    
    // Create ProductImages table
    await queryInterface.createTable('ProductImages', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
    
    // Add foreign key constraint
    await queryInterface.addConstraint('ProductImages', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'productimages_productid_foreign',
      references: {
        table: 'Products',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
    
    console.log('ProductImages table created successfully!');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ProductImages table already exists');
    } else {
      console.error('Error creating ProductImages table:', error);
    }
  }
  
  await sequelize.close();
}

createProductImagesTable();
