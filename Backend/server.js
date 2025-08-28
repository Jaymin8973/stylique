const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const userRoutes = require('./Routes/UserRoutes');
const paymentCardRoutes = require('./Routes/PaymentCradRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/payment-cards', paymentCardRoutes);

// Sync DB and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
