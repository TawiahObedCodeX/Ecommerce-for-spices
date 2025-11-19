// Routes for messaging between clients and admin (one-on-one section)

import { Router } from 'express';
import Joi from 'joi';
import { pool } from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const messageSchema = Joi.object({
  receiver_id: Joi.string().uuid().required(),
  content: Joi.string().min(1).required(),
});

router.post('/', async (req, res, next) => {
  try {
    const { receiver_id, content } = await messageSchema.validateAsync(req.body);
    const { rows } = await pool.query(
      'INSERT INTO messages(sender_id, receiver_id, content) VALUES($1,$2,$3) RETURNING *',
      [req.user.id, receiver_id, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) { if (err.isJoi) err.status = 400; next(err); }
});

// Get conversation between authenticated user and another user
router.get('/conversation/:otherUserId', async (req, res, next) => {
  try {
    const other = req.params.otherUserId;
    const { rows } = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)
       ORDER BY created_at ASC`,
      [req.user.id, other]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// Admin can fetch all messages (for moderation or analytics)
router.get('/', authorize('admin'), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { next(err); }
});

export default router;
