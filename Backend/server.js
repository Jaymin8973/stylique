const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const userRoutes = require('./Routes/UserRoutes');
const paymentCardRoutes = require('./Routes/PaymentCradRoutes');
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
app.use('/payment-cards', paymentCardRoutes);

// Sync DB and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
