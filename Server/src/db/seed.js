// Seed script to create an initial admin and sample products
// Usage: npm run seed

import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { pool } from '../lib/db.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

async function main() {
  const adminEmail = 'admin@spices.local';
  const adminPass = 'admin123';
  const adminName = 'Admin User';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create admin if not exists
    const existing = await client.query('SELECT id FROM users WHERE email=$1', [adminEmail]);
    let adminId;
    if (existing.rowCount === 0) {
      const hash = await bcrypt.hash(adminPass, 10);
      const { rows } = await client.query(
        'INSERT INTO users(id, email, password_hash, full_name, role) VALUES($1,$2,$3,$4,$5) RETURNING id',
        [uuidv4(), adminEmail, hash, adminName, 'admin']
      );
      adminId = rows[0].id;
      console.log('Created admin user:', adminEmail, 'password:', adminPass);
    } else {
      adminId = existing.rows[0].id;
      console.log('Admin user already exists:', adminEmail);
    }

    // Insert sample products
    const productCount = await client.query('SELECT COUNT(*) FROM products');
    if (Number(productCount.rows[0].count) === 0) {
      const sample = [
        ['Turmeric Powder', 'Rich in color and flavor', 599, 'https://picsum.photos/seed/turmeric/400', 'Spices', 100],
        ['Cumin Seeds', 'Aromatic cumin seeds', 799, 'https://picsum.photos/seed/cumin/400', 'Spices', 50],
        ['Coriander', 'Freshly dried coriander', 399, 'https://picsum.photos/seed/coriander/400', 'Spices', 70]
      ];
      for (const [name, description, price_cents, image_url, category, stock] of sample) {
        await client.query(
          'INSERT INTO products(id,name,description,price_cents,image_url,category,stock) VALUES($1,$2,$3,$4,$5,$6,$7)',
          [uuidv4(), name, description, price_cents, image_url, category, stock]
        );
      }
      console.log('Inserted sample products');
    } else {
      console.log('Products already seeded');
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    process.exit(1);
  } finally {
    client.release();
  }
}

main().then(() => process.exit(0));
