const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Stylique API is running!' });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Rating route for testing
app.get('/rating/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    avgRating: '4.50',
    totalCount: 0,
    ratingPercentages: { '5': '80', '4': '15', '3': '3', '2': '1', '1': '1' }
  });
});

// Import routes
const productRoutes = require('./Routes/productRoutes');
const ratingRoutes = require('./Routes/RatingRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const subCategoryRoutes = require('./Routes/subCategoryRoutes');
const userRoutes = require('./Routes/UserRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const cartItemRoutes = require('./Routes/cartItemRoutes');
const addressRoutes = require('./Routes/Address');
const paymentCardRoutes = require('./Routes/PaymentCradRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const orderItemRoutes = require('./Routes/orderItemRoutes');
const wishlistRoutes = require('./Routes/wishlistRoutes');

// Use routes
app.use('/products', productRoutes);
app.use('/rating-full', ratingRoutes);
app.use('/categories', categoryRoutes);
app.use('/subcategories', subCategoryRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/cartitems', cartItemRoutes);
app.use('/addresses', addressRoutes);
app.use('/paymentcards', paymentCardRoutes);
app.use('/orders', orderRoutes);
app.use('/orderitems', orderItemRoutes);
app.use('/wishlist', wishlistRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://192.168.1.8:${PORT}`);
});
