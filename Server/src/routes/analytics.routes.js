// Routes to power simple admin analytics pages

import { Router } from 'express';
import { pool } from '../lib/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/summary', async (req, res, next) => {
  try {
    const [{ rows: users }, { rows: orders }, { rows: revenue }, { rows: products }] = await Promise.all([
      pool.query('SELECT COUNT(*)::int as count FROM users'),
      pool.query("SELECT COUNT(*)::int as count FROM orders WHERE status <> 'cancelled'"),
      pool.query("SELECT COALESCE(SUM(total_cents),0)::int as cents FROM orders WHERE status IN ('paid','shipped','delivered')"),
      pool.query('SELECT COUNT(*)::int as count FROM products'),
    ]);
    res.json({
      users: users[0].count,
      orders: orders[0].count,
      revenue_cents: revenue[0].cents,
      products: products[0].count,
    });
  } catch (err) { next(err); }
});

router.get('/sales-by-day', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT date_trunc('day', created_at) as day, SUM(total_cents)::int as revenue_cents
       FROM orders WHERE status IN ('paid','shipped','delivered')
       GROUP BY 1 ORDER BY 1`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

export default router;
