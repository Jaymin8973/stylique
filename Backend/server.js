const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const userRoutes = require('./Routes/UserRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const productVariantRoutes = require('./routes/productVariantRoutes');
const variantImageRoutes = require('./routes/variantImageRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cartItemRoutes = require('./routes/cartItemRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const returnRoutes = require('./routes/returnRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const discountRoutes = require('./routes/discountRoutes');
require('dotenv').config();
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/subcategories', subCategoryRoutes);
app.use('/products', productRoutes);
app.use('/product-variants', productVariantRoutes);
app.use('/variant-images', variantImageRoutes);
app.use('/carts', cartRoutes);
app.use('/cart-items', cartItemRoutes);
app.use('/wishlists', wishlistRoutes);
app.use('/orders', orderRoutes);
app.use('/order-items', orderItemRoutes);
app.use('/payments', paymentRoutes);
app.use('/returns', returnRoutes);
app.use('/ratings', ratingRoutes);
app.use('/notifications', notificationRoutes);
app.use('/discounts', discountRoutes);


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
