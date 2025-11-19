// Entry point of the Express server
// Sets up middleware, routes, error handling, and starts the HTTP server.

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { pool } from './lib/db.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import messageRoutes from './routes/message.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import adsRoutes from './routes/ads.routes.js';

dotenv.config();

const app = express();

// Basic security headers
app.use(helmet());

// Log HTTP requests in development
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse JSON request bodies
app.use(express.json({ limit: '1mb' }));

// Enable CORS for the frontend origin from env
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || '*',
  credentials: true,
}));

// Health check to verify DB connectivity
app.get('/api/health', async (req, res, next) => {
  try {
    const r = await pool.query('SELECT 1 as ok');
    res.json({ status: 'ok', db: r.rows[0].ok === 1 });
  } catch (err) {
    next(err);
  }
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ads', adsRoutes);

// Not found and error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
