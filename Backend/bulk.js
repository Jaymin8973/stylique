const fs = require('fs');
const Product  = require('./Models/Product');

async function bulkInsert() {
  try {
    const rawData = fs.readFileSync('product.json'); 
    const products = JSON.parse(rawData);

    await Product.bulkCreate(products);

    console.log('Products inserted successfully!');
  } catch (error) {
    console.error('Error inserting products:', error);
  }
}

bulkInsert();
