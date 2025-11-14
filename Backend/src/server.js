import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prismaClient.js';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import cartRouter from './routes/cart.js';
import wishlistRouter from './routes/wishlist.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'DB connection failed' });
  }
});

// Auth API
app.use('/api/auth', authRouter);

// Products API
app.use('/api/products', productsRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/wishlist', wishlistRouter);
app.use('/api/wishlist', wishlistRouter);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
