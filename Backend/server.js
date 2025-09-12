const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const userRoutes = require('./Routes/UserRoutes');
const paymentCardRoutes = require('./Routes/PaymentCradRoutes');
require('dotenv').config();
const cors = require('cors');
const Address = require('./Routes/Address');
const Category = require('./Routes/Category');
const Product = require('./Routes/Product');
const SubCategory = require('./Routes/SubCategory');
const ProductRating = require('./Routes/RatingRoutes');


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
app.use('/payment-cards', paymentCardRoutes);
app.use('/address', Address);
app.use('/categories', Category);
app.use('/subcategories', SubCategory);
app.use('/products', Product);
app.use('/rating', ProductRating);


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
