const Product = require('../Models/Product');
const Category = require('../Models/Category');
const SubCategory = require('../Models/SubCategory');
const ProductImage = require('../Models/ProductImage');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    console.log('🔍 getAllProducts called via HTTP');
    const products = await Product.findAll({
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: SubCategory, attributes: ['id', 'name'] },
        { 
          model: ProductImage, 
          as: 'images',
          required: false // LEFT JOIN to include products without images
        }
      ]
    });
    
    console.log(`📦 Found ${products.length} products`);
    console.log(`🖼️ First product has ${products[0]?.images?.length || 0} images`);
    
    // Transform the data to match frontend expectations
    const transformedProducts = products.map(product => {
      // Find primary image or first image as fallback
      const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
      
      return {
        productId: product.id,
        name: product.name,
        description: product.description,
        brand: product.brand,
        imageUrl: primaryImage?.imageUrl || product.imageUrl, // Fallback to single imageUrl
        price: product.price,
        stockQuantity: product.stockQuantity,
        category: product.Category?.name,
        subcategory: product.SubCategory?.name,
        images: product.images?.map(img => ({
          imageId: img.imageId,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder
        })) || []
      };
    });
    
    console.log(`✅ Transformed ${transformedProducts.length} products`);
    console.log(`🖼️ First transformed product has ${transformedProducts[0]?.images?.length || 0} images`);
    
    res.status(200).json(transformedProducts);
  } catch (error) {
    console.error('❌ Error in getAllProducts:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: SubCategory, attributes: ['id', 'name'] },
        { 
          model: ProductImage, 
          as: 'images',
          required: false // LEFT JOIN to include products without images
        }
      ]
    });
    if (product) {
      // Find primary image or first image as fallback
      const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
      
      // Transform the data to match frontend expectations
      const transformedProduct = {
        productId: product.id,
        name: product.name,
        description: product.description,
        brand: product.brand,
        imageUrl: primaryImage?.imageUrl || product.imageUrl, // Primary image for display
        price: product.price,
        stockQuantity: product.stockQuantity,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        Category: product.Category,
        SubCategory: product.SubCategory,
        images: product.images?.sort((a, b) => a.displayOrder - b.displayOrder).map(img => ({
          imageId: img.imageId,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder
        })) || [] // All images sorted by display order
      };
      res.json(transformedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Product deleted' });
    else res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
