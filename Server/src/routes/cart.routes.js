// Routes for managing the user's cart

import { Router } from 'express';
import Joi from 'joi';
import { pool } from '../lib/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, p.name, p.price_cents, p.image_url FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id=$1`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

const upsertSchema = Joi.object({
  product_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

router.post('/', async (req, res, next) => {
  try {
    const { product_id, quantity } = await upsertSchema.validateAsync(req.body);
    const { rows } = await pool.query(
      `INSERT INTO cart_items(user_id, product_id, quantity)
       VALUES($1,$2,$3)
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity
       RETURNING *`,
      [req.user.id, product_id, quantity]
    );
    res.status(201).json(rows[0]);
  } catch (err) { if (err.isJoi) err.status = 400; next(err); }
});

router.delete('/:productId', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id=$1 AND product_id=$2', [req.user.id, req.params.productId]);
    res.status(204).send();
  } catch (err) { next(err); }
});

router.delete('/', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id=$1', [req.user.id]);
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
