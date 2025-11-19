// Routes for creating and tracking orders

import { Router } from 'express';
import Joi from 'joi';
import { pool, withTransaction } from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const checkoutSchema = Joi.object({
  shipping_address: Joi.string().required(),
  payment_ref: Joi.string().allow('').default(''),
});

// Create order from cart
router.post('/checkout', authenticate, async (req, res, next) => {
  try {
    const { shipping_address, payment_ref } = await checkoutSchema.validateAsync(req.body);

    const order = await withTransaction(async (client) => {
      // Load cart for user
      const { rows: cart } = await client.query(
        `SELECT c.product_id, c.quantity, p.name, p.price_cents, p.stock
         FROM cart_items c JOIN products p ON p.id=c.product_id
         WHERE c.user_id=$1`,
        [req.user.id]
      );
      if (cart.length === 0) throw Object.assign(new Error('Cart is empty'), { status: 400 });

      // Validate stock
      for (const item of cart) {
        if (item.quantity > item.stock) {
          throw Object.assign(new Error(`Insufficient stock for ${item.name}`), { status: 400 });
        }
      }

      // Compute total
      const total = cart.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);

      // Create order
      const { rows: orderRows } = await client.query(
        `INSERT INTO orders(user_id,status,total_cents,shipping_address,payment_ref)
         VALUES($1,'paid',$2,$3,$4) RETURNING *`,
        [req.user.id, total, shipping_address, payment_ref]
      );
      const order = orderRows[0];

      // Insert order items, reduce stock
      for (const item of cart) {
        await client.query(
          `INSERT INTO order_items(order_id, product_id, name, price_cents, quantity)
           VALUES($1,$2,$3,$4,$5)`,
          [order.id, item.product_id, item.name, item.price_cents, item.quantity]
        );
        await client.query('UPDATE products SET stock = stock - $1 WHERE id=$2', [item.quantity, item.product_id]);
      }

      // Clear cart
      await client.query('DELETE FROM cart_items WHERE user_id=$1', [req.user.id]);

      return order;
    });

    res.status(201).json(order);
  } catch (err) { if (err.isJoi) err.status = 400; next(err); }
});

// Get my orders (client)
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) { next(err); }
});

// Get order details (items)
router.get('/:orderId', authenticate, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [req.params.orderId, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });
    const order = rows[0];
    const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id=$1', [order.id]);
    res.json({ ...order, items });
  } catch (err) { next(err); }
});

// Admin: list all orders
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { next(err); }
});

// Admin: update order status (e.g., track order progress)
const statusSchema = Joi.object({ status: Joi.string().valid('pending','paid','shipped','delivered','cancelled').required() });
router.patch('/:orderId/status', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { status } = await statusSchema.validateAsync(req.body);
    const { rows } = await pool.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.orderId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });
    res.json(rows[0]);
  } catch (err) { if (err.isJoi) err.status = 400; next(err); }
});

export default router;
