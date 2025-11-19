// Routes for admin ads posting and client browsing ads

import { Router } from 'express';
import Joi from 'joi';
import { pool } from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public list ads for clients
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ads ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { next(err); }
});

const adSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  image_url: Joi.string().uri().allow(''),
});

// Admin create ad
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const data = await adSchema.validateAsync(req.body);
    const { rows } = await pool.query(
      'INSERT INTO ads(title, description, image_url, created_by) VALUES($1,$2,$3,$4) RETURNING *',
      [data.title, data.description, data.image_url, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { if (err.isJoi) err.status = 400; next(err); }
});

// Admin delete ad
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM ads WHERE id=$1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Ad not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
