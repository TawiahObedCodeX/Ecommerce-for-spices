// CRUD routes for products

import { Router } from 'express';
import Joi from 'joi';
import { pool } from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price_cents: Joi.number().integer().min(0).required(),
  image_url: Joi.string().uri().allow(''),
  category: Joi.string().allow(''),
  stock: Joi.number().integer().min(0).default(0),
});

router.get('/', async (req, res, next) => {
  try {
    const { category, q } = req.query;
    let where = [];
    let params = [];
    if (category) { params.push(category); where.push(`category=$${params.length}`); }
    if (q) { params.push(`%${q}%`); where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`); }
    const sql = `SELECT * FROM products ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`;
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const data = await productSchema.validateAsync(req.body);
    const { rows } = await pool.query(
      'INSERT INTO products(name,description,price_cents,image_url,category,stock) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [data.name, data.description, data.price_cents, data.image_url, data.category, data.stock]
    );
    res.status(201).json(rows[0]);
  } catch (err) { if (err.isJoi) err.status = 400; next(err); }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const data = await productSchema.validateAsync(req.body);
    const { rows } = await pool.query(
      'UPDATE products SET name=$1, description=$2, price_cents=$3, image_url=$4, category=$5, stock=$6 WHERE id=$7 RETURNING *',
      [data.name, data.description, data.price_cents, data.image_url, data.category, data.stock, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) { if (err.isJoi) err.status = 400; next(err); }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
