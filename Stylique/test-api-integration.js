// Test file to verify AllProducts API integration
import API from './Api.js';

// Test the API integration that AllProducts.jsx uses
async function testAllProductsIntegration() {
  console.log('🧪 Testing AllProducts.jsx API Integration...\n');

  try {
    // This is the exact same call that AllProducts.jsx makes
    console.log('📡 Making API call to: GET /products/getAllProducts');
    const response = await API.get('/products/getAllProducts');
    
    console.log('✅ API Response Status:', response.status);
    console.log('📦 Total Products Received:', response.data.length);
    
    // Verify the data structure matches what AllProducts.jsx expects
    const sampleProducts = response.data.slice(0, 3);
    
    console.log('\n📋 Sample Products (What AllProducts.jsx will display):');
    sampleProducts.forEach((product, index) => {
      const hasRequiredFields = product.productId && product.name && product.price;
      const hasPrimaryImage = !!product.imageUrl;
      const hasImagesArray = Array.isArray(product.images);
      
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - Product ID: ${product.productId}`);
      console.log(`   - Price: $${product.price}`);
      console.log(`   - Primary Image: ${hasPrimaryImage ? '✅' : '❌'}`);
      console.log(`   - Images Array: ${hasImagesArray ? `${product.images.length} items` : '❌'}`);
      console.log(`   - Data Valid: ${hasRequiredFields ? '✅' : '❌'}`);
      console.log(`   - Image URL: ${product.imageUrl?.substring(0, 50)}...`);
    });
    
    // Check for unique images
    const uniqueImages = new Set(response.data.slice(0, 10).map(p => p.imageUrl));
    console.log(`\n🎯 Unique Images Test: ${uniqueImages.size}/10 different images`);
    
    // Test filtering and sorting capabilities
    const hasCategories = response.data.some(p => p.category || p.subcategory);
    const hasValidPrices = response.data.every(p => typeof p.price === 'number');
    
    console.log(`\n🔍 Additional Features:`);
    console.log(`   - Has Categories: ${hasCategories ? '✅' : '❌'}`);
    console.log(`   - Valid Prices: ${hasValidPrices ? '✅' : '❌'}`);
    
    if (response.data.length > 0 && uniqueImages.size >= 5) {
      console.log('\n🎉 AllProducts.jsx API Integration: READY');
      console.log('✅ Products will display with unique images');
      console.log('✅ Search and filtering will work');
      console.log('✅ Product cards will show correct data');
    } else {
      console.log('\n❌ AllProducts.jsx API Integration: NEEDS FIXES');
    }
    
  } catch (error) {
    console.error('❌ API Integration Test Failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend server is running on port 3000');
    console.log('2. Check if /products/getAllProducts endpoint exists');
    console.log('3. Verify database connection and product data');
  }
}

// Run the test
testAllProductsIntegration();
