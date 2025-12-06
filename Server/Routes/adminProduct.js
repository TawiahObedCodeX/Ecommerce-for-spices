// routes/adminProducts.js
// Commit: Add full CRUD for spice products (Admin only) with file upload support

import express from "express";
import multer from "multer";
import path from "path";
import { adminAuth } from "../middleware/auth.js";
import pool from "../Config/db.js";

const router = express.Router();

// Multer config - save files to /uploads folder (create it in root)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|webm|mov/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only images and videos are allowed"));
  },
});

// POST /api/admin/products - Create new product
router.post(
  "/",
  adminAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, category, description, price, rating } = req.body;

      if (!name || !category || !price || !req.files?.image || !req.files?.video) {
        return res.status(400).json({ error: "All fields including image and video are required" });
      }

      const image_url = `/uploads/${req.files.image[0].filename}`;
      const video_url = `/uploads/${req.files.video[0].filename}`;

      const result = await pool.query(
        `INSERT INTO products 
         (name, category, description, price, rating, image_url, video_url, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          name,
          category,
          description || null,
          parseFloat(price),
          parseInt(rating) || 0,
          image_url,
          video_url,
          req.admin.id,
        ]
      );

      res.status(201).json({
        message: "Product added successfully!",
        product: result.rows[0],
      });
    } catch (err) {
      console.error("Add product error:", err);
      res.status(500).json({ error: "Failed to add product" });
    }
  }
);

// GET /api/admin/products - Get all products (for admin panel)
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, a.full_name as added_by_name 
       FROM products p
       LEFT JOIN admins a ON p.admin_id = a.id
       WHERE p.is_active = true
       ORDER BY p.created_at DESC`
    );

    res.json({ products: result.rows });
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// PUT /api/admin/products/:id - Update product
router.put(
  "/:id",
  adminAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, description, price, rating } = req.body;

      const updates = [];
      const values = [];
      let index = 1;

      if (name) { updates.push(`name = $${index++}`); values.push(name); }
      if (category) { updates.push(`category = $${index++}`); values.push(category); }
      if (description !== undefined) { updates.push(`description = $${index++}`); values.push(description || null); }
      if (price) { updates.push(`price = $${index++}`); values.push(parseFloat(price)); }
      if (rating) { updates.push(`rating = $${index++}`); values.push(parseInt(rating)); }

      if (req.files?.image) {
        updates.push(`image_url = $${index++}`);
        values.push(`/uploads/${req.files.image[0].filename}`);
      }
      if (req.files?.video) {
        updates.push(`video_url = $${index++}`);
        values.push(`/uploads/${req.files.video[0].filename}`);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      values.push(id);
      updates.push(`updated_at = NOW()`);

      const result = await pool.query(
        `UPDATE products SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ message: "Product updated!", product: result.rows[0] });
    } catch (err) {
      console.error("Update product error:", err);
      res.status(500).json({ error: "Update failed" });
    }
  }
);

// DELETE /api/admin/products/:id - Soft delete (set is_active = false)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE products SET is_active = false, updated_at = NOW() 
       WHERE id = $1 AND admin_id = $2 
       RETURNING id, name`,
      [id, req.admin.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found or unauthorized" });
    }

    res.json({ message: `Product "${result.rows[0].name}" deleted successfully` });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;